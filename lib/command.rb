class Command
  class CommandError < StandardError; end

  def run(args)
    cmd = args.shift || 'start'
    if (command = commands[cmd])
      command.call(parse_options(args))
    else
      raise CommandError, "Unknown command: #{cmd}"
    end
  rescue CommandError => e
    puts "Error: #{e.message}"
    show_help
    exit 1
  end

  private

  def commands
    {
      'start' => -> (opts) { run_server(opts) },
      '-h'    => -> (_) { show_help },
      '--help'=> -> (_) { show_help },
      '-v'    => -> (_) { show_version },
      '--version' => -> (_) { show_version }
    }.freeze
  end

  def run_server(options)
    Server.new(options).start
  end

  def show_version
    puts "brewiz #{VERSION}"
  end

  def show_help
    puts <<~HELP
      brewiz #{VERSION} - Homebrew Package Manager UI

      Usage: brewiz [command] [options]

      Commands:
          #{command_help.join("\n    ")}

      Options for #{command_options_help}:
    HELP
    puts parse_options(['-h'])
  end

  def command_help
    [
      "start         Start server in production mode",
      "-h, --help    Show this help message",
      "-v, --version Show version"
    ]
  end

  def command_options_help
    "start command"
  end

  def default_options
    {
      port: 8047,
      address: 'localhost',
      packages_url: 'https://raw.githubusercontent.com/wstein/brewiz/refs/heads/main/data/packages.yaml'
    }
  end

  def parse_options(args)
    options = default_options

    OptionParser.new do |opts|
      opts.banner = "Usage: brewiz [#{command_usage}] [options]"
      add_options(opts, options)
    end.parse!(args)

    options
  end

  def command_usage
    "start"
  end

  def add_options(opts, options)
    opts.on("-a", "--address ADDRESS", "Address to run Server on") { |v| options[:address] = v }
    opts.on("-p", "--port PORT", Integer, "Port to run Server on") { |v| options[:port] = v }
    opts.on("--packages-url URL", "URL to package list") { |v| options[:packages_url] = v }
    opts.on("--packages-file PATH", "Path to local package list") { |v| options[:packages_file] = v }
    opts.on("--no-open", "Don't open browser automatically") { options[:no_open] = 1 }
    opts.on("-h", "--help") { puts opts; exit }
  end
end
