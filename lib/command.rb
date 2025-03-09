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
      packages_url: 'https://brewiz.github.io/data/packages.yaml',
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
    opts.on("--packages-url URL", "URL to package list") { |v| options[:packages_url] = v }
    opts.on("--packages-file PATH", "Path to local package list") { |v| options[:packages_file] = v }
    opts.on("--no-open", "Don't open browser automatically") { options[:no_open] = 1 }
    opts.on("-v", "--version", "Show version") { show_version; exit }
    opts.on("-h", "--help", "Show this help message") { puts opts; exit }
  end
end
