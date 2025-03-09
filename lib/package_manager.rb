class PackageManager
  attr_reader :packages

  def initialize(homebrew, options)
    @homebrew = homebrew
    @options = options
  end

  def reload
    @packages = load_config
    @homebrew.update
    update_packages_with_brew_info
    add_missing_infos
    @packages
  end

  private

  def add_missing_infos
    @packages.each do |category|
      category['packages'].each do |pkg|
        tap = pkg['id'].rpartition('/')[0]
        pkg['tap'] = tap unless ['homebrew/cask', 'homebrew/core'].include?(tap)
      end
    end
  end

  def load_config
    source = @options[:packages_file] ? File.read(@options[:packages_file]) : URI.open(@options[:packages_url]).read
    YAML.safe_load(source)
  end

  def update_packages_with_brew_info
    brew_info = @homebrew.info.to_h { |pkg| [pkg['id'], pkg] }

    @packages.each do |category|
      category['packages'].map! do |pkg|
        pkg.merge(brew_info.delete(pkg['id']) || {})
           .select { |k, v| v }
      end
    end

    add_uncategorized_packages(brew_info)
  end

  def add_uncategorized_packages(remaining_packages)
    uncategorized = @packages.find { |cat| cat['id'] == 'uncategorized' }
    return unless uncategorized

    uncategorized['packages'] += remaining_packages.values.select { |pkg| pkg['installed_on_request'] }
    @packages.delete(uncategorized) if uncategorized['packages'].empty?
    @packages.sort_by! { |cat| [cat['id'] == 'uncategorized' ? 1 : 0, cat['name'].downcase] }
  end
end
