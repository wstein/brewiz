class Command
  class CommandError < StandardError; end

  def run(args)
    run_server(parse_options(args))
  rescue OptionParser::InvalidOption => e
    puts "Error: #{e.message}"
    puts parse_options(["-h"])
    exit 1
  end

  private

  def run_server(options)
    Server.new(options).start
  end

  def show_version
    puts "brewiz #{VERSION}"
  end

  def default_options
    {
      port: 8047,
      address: 'localhost',
      packages_yaml: 'https://brewiz.github.io/data/packages.yaml',
      app_url: "https://raw.githubusercontent.com/wstein/brewiz/refs/tags/v#{VERSION}/app/dist",
    }
  end

  def parse_options(args)
    options = default_options

    OptionParser.new do |opts|
      opts.banner = "Usage: brewiz [options]"

      add_options(opts, options)
    end.parse!(args)

    options
  end

  def add_options(opts, options)
    opts.on("-a", "--address ADDRESS", "Address to run Server on") { |v| options[:address] = v }
    opts.on("-p", "--port PORT", Integer, "Port to run Server on") { |v| options[:port] = v }
    opts.on('-c', '--cache', 'Enable caching of brew info results') { |v| options[:cache_enabled] = v }
    opts.on("--packages LOCATION", "URL or file path to packages.yaml package list") { |v| options[:packages_yaml] = v }
    opts.on("--no-open", "Don't open browser automatically") { options[:no_open] = 1 }
    opts.on("-v", "--version", "Show version") { show_version; exit }
    opts.on("-h", "--help", "Show this help message") { puts opts; exit }
  end
end
