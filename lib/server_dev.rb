class DevServer < Server
  def initialize(options)
    @options = options
    @homebrew = Homebrew.new
    @package_manager = PackageManager.new(@homebrew, options)
    @dev_server_pid = nil
  end

  def start
    start_dev_server
    super
  rescue StandardError
    Process.kill('TERM', @dev_server_pid) if @dev_server_pid
    sleep(0.1) # Wait for dev server to terminate
    raise
  end

  private

  def setup_server
    puts "Starting Server on http://#{@options[:address]}:#{@options[:port]}"
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

  def start_dev_server
    puts "Starting Frontend Dev Server on http://#{@options[:address]}:#{@options[:dev_node_port]}"
    command = "npm run dev -- --strictPort --port #{@options[:dev_node_port]}"
    pid = Process.spawn(command, chdir: File.expand_path('..', __FILE__))

    # Check for errors after 200ms
    sleep(0.2)
    begin
      Process.getpgid(pid)
    rescue Errno::ESRCH
      puts <<~ERROR
        Error: Dev server failed to start. Please check your frontend dependencies.

        Please make sure you have checked out the project:

          $ git clone https://github.com/wstein/brewiz.git
          $ cd brewiz
          $ npm install
      ERROR
      exit 1
    end
    @dev_server_pid = pid
  end
end
