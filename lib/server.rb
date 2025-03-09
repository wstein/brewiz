class Server
  def initialize(options)
    @options = options
    @homebrew = Homebrew.new
    @package_manager = PackageManager.new(@homebrew, options)
  end

  def start
    @package_manager.reload
    @server = setup_server
    open_browser unless @options[:no_open]
    puts "Press Ctrl-C to stop"
    @server.start
  rescue Interrupt
    @server.shutdown
  rescue StandardError => e
    puts "Error: #{e.message}"
    exit 1
  end

  private

  def setup_server
    puts "Starting Server on http://#{@options[:address]}:#{@options[:port]}"
    server = WEBrick::HTTPServer.new(
      Port: @options[:port],
      BindAddress: @options[:address],
      Logger: WEBrick::Log.new($stderr, WEBrick::Log::INFO),
      AccessLog: []
    )
    server.mount('/', RequestHandler, @homebrew, @package_manager, @options)
    trap('INT') { server.shutdown }
    server
  end

  def open_browser
    Thread.new do
      puts "Waiting for Server to start..."
      sleep(0.1) until port_open?

      puts "Opening http://#{@options[:address]}:#{@options[:port]} in your browser..."
      system('open', "http://#{@options[:address]}:#{@options[:port]}")
    end
  end

  def port_open?
    Net::HTTP.get_response(URI("http://#{@options[:address]}:#{@options[:port]}")).is_a?(Net::HTTPSuccess)
  rescue StandardError
    false
  end
end
