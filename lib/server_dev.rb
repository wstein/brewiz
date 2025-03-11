class DevServer < Server
  def initialize(options)
    @options = options
    @homebrew = Homebrew.new
    @package_manager = PackageManager.new(@homebrew, options)
  end

  private

  def setup_server
    node_server_port_open?
    server = WEBrick::HTTPServer.new(
      Port: @options[:port],
      BindAddress: @options[:address],
      Logger: WEBrick::Log.new($stderr, WEBrick::Log::INFO),
      AccessLog: [[$stderr, WEBrick::AccessLog::COMBINED_LOG_FORMAT]]
    )
    server.mount('/', DevRequestHandler, @homebrew, @package_manager, @options, @dev_server_pid)
    trap('INT') { server.shutdown }
    server
  end

  def node_server_port_open?
    Net::HTTP.get_response(URI(@options[:app_url]))
  rescue StandardError
    puts "Error: Node server not running on #{@options[:app_url]}"
    exit 1
  end
end
