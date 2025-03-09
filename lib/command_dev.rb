class DevCommand < Command
  private

  def run_dev_server(options)
    DevServer.new(options).start
  end

  def commands
    { 'dev' => -> (opts) { run_dev_server(opts) }}.merge(super)
  end
  def command_help
    super.insert(1, "dev           Start server in development mode")
  end

  def command_usage
    "start|dev"
  end

  def command_options_help
    "start/dev commands"
  end

  def default_options
    super.merge(
      dev_mode: false,
      dev_node_port: 8048,
      packages_file: 'data/packages.yaml',
    )
  end

  def add_options(opts, options)
    super
    opts.on("--dev-node-port PORT", Integer, "Port to use for frontend development server") { |v| options[:dev_node_port] = v }
  end
end
