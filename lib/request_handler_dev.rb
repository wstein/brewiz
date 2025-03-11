class DevRequestHandler < RequestHandler
  def initialize(server, homebrew, package_manager, options, dev_server_pid)
    super(server, homebrew, package_manager, options)
    @dev_server_pid = dev_server_pid
  end

  def do_GET(request, response)
    if !request.path.start_with?('/api/')
      proxy_to_dev_server(request, response)
    else
      super
    end
  end

  def do_POST(request, response)
    case request.path
    when '/api/v1/terminate'
      Process.kill('TERM', @dev_server_pid) if @dev_server_pid
    end
    super
  end

  private

  def proxy_to_dev_server(request, response)
    return serve_homebrew_svg(response) if request.path == '/homebrew.svg'

    uri = URI(options[:app_url] + request.path)
    proxy_response = Net::HTTP.get_response(uri)
    copy_response(proxy_response, response)
  rescue StandardError => e
    response.status = 502
    json_response(response, {error: e.message})
  end

  def copy_response(from, to)
    to.status = from.code
    from.each_header { |k, v| to[k] = v }
    to.body = from.body
  end
end
