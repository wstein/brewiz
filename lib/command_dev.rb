class DevCommand < Command
  private

  def run_server(options)
    if options[:dev_mode]
      DevServer.new(options).start
    else
      super
    end
  end

  def default_options
    super.merge(
      dev_node_port: 8048,
    )
  end

  def add_options(opts, options)
    opts.on("-d", "--dev", "Run in development mode") { |v| options[:dev_mode] = v }
    opts.on("--dev-node-port PORT", Integer, "Port to use for frontend development server") { |v| options[:dev_node_port] = v }
    super
  end
end
