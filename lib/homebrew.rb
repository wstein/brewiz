class Homebrew
  def initialize
    check_brew_installed
  end

  def info
    puts "Getting local Packages..."
    output = brew_cmd('info', '--installed', '--json=v2')
    data = JSON.parse(output)
    process_info(data['formulae'], false) + process_info(data['casks'], true)
  end

  def update
    puts "Updating Homebrew..."
    res = brew_cmd('update')
    puts res if res.length > 0
  end

  private

  def find_brew
    ['/opt/homebrew/bin/brew', '/usr/local/bin/brew'].find { |path| File.exist?(path) }
  end

  def check_brew_installed
    return if @brew = find_brew

    puts <<~ERROR
    Error: Homebrew is not installed!"

    Check out https://docs.brew.sh/Installation to see how to install Homebrew and
    follow the instructions. That'll finally get you to run this command:

      $ curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh | bash -s
    ERROR

    exit 1
  end

  def brew_cmd(*args)
    stdout, stderr, status = Open3.capture3(@brew, *args)
    raise stderr unless status.success?
    stdout
  end

  def process_info(packages, is_cask)
    packages.map do |pkg|
      {
        'name' => is_cask ? pkg['name'][0] : pkg['name'],
        'id' => "#{pkg['tap']}/#{is_cask ? pkg['token'] : pkg['name']}",
        'desc' => pkg['desc'],
        'homepage' => pkg['homepage'],
        'installed' => true,
        'installed_on_request' => is_cask || pkg['installed'].any? { |i| i['installed_on_request'] },
        'outdated' => pkg['outdated'],
        'cask' => is_cask,
        'versions' => is_cask ? [ pkg['version'] ] : pkg['installed'].map { |i| i['version'] },
        'latest_version' => is_cask ? pkg['version'] : pkg['versions']['stable']
      }
    end
  end
end
