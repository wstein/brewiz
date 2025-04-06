class Server
  def initialize(options)
    @options = options
    @homebrew = Homebrew.new
    @package_manager = PackageManager.new(@homebrew, options)
  end

  def start
    @package_manager.read_from_cache_or_reload_packages
    @server = setup_server
    open_browser unless @options[:no_open]
    puts "Press Ctrl-C to stop"
    @server.start
  rescue Interrupt
    @server.shutdown
  rescue StandardError => e
    raise "Error starting server: #{e.message}"
  end

  private

  def setup_server
    frontend_server_port_open?
    puts "Starting Server on http://#{@options[:address]}:#{@options[:port]}"
    server = WEBrick::HTTPServer.new(
      Port: @options[:port],
      BindAddress: @options[:address],
      Logger: WEBrick::Log.new($stderr, WEBrick::Log::INFO),
      AccessLog: @options[:access_log] ? [[$stderr, WEBrick::AccessLog::COMBINED_LOG_FORMAT]] : []
    )
    server.mount('/', RequestHandler, @homebrew, @package_manager, @options)
    trap('INT') { server.shutdown }
    server
  end

  def open_browser
    Thread.new do
      sleep(0.2) until port_open?

      puts "Opening http://#{@options[:address]}:#{@options[:port]} in your browser..."
      system('open', "http://#{@options[:address]}:#{@options[:port]}")
    end
  end

  def port_open?
    Net::HTTP.get_response(URI("http://#{@options[:address]}:#{@options[:port]}")).is_a?(Net::HTTPSuccess)
  rescue StandardError
    false
  end

  def frontend_server_port_open?
    Net::HTTP.get_response(URI(@options[:app_url]))
  rescue StandardError
    raise "Node server not running on #{@options[:app_url]}"
  end
end
