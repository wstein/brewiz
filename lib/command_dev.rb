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
      dev_mode: false,
      app_url_override: "http://localhost:8048"
    )
  end

  def parse_options(args)
    options = super(args)
    options[:app_url] = options[:app_url_override] if options[:dev_mode]
    options
  end

  def add_options(opts, options)
    opts.on("--app-url URL", "URL for frontend assets") { |v| options[:app_url_override] = v }
    opts.on("-d", "--dev", "Run in development mode") { |v| options[:dev_mode] = v }
    super(opts, options)
  end
end
