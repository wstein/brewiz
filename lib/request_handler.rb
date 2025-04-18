class RequestHandler < WEBrick::HTTPServlet::AbstractServlet
  def initialize(server, homebrew, package_manager, options)
    super(server)
    @homebrew = homebrew
    @package_manager = package_manager
    @options = options
  end

  def do_GET(request, response)
    case request.path
    when '/api/v1/packages'
      json_response(response, @package_manager.packages)
    when '/api/v1/reload'
      json_response(response, @package_manager.reload)
    when '/api/v1/version'
      json_response(response, {
        brewiz: VERSION,
      })
    else
      serve_static_file(request, response)
    end
  end

  def do_POST(request, response)
    case request.path
    when '/api/v1/terminate'
      @server.shutdown
      json_response(response, { status: 'terminating' })
    else
      super
    end
  end

  private

  def json_response(response, data)
    response['Content-Type'] = 'application/json'
    response.body = data.to_json
  end

  def serve_static_file(request, response)
    case request.path
    when '/homebrew.svg'
      serve_homebrew_svg(response)
    when '/'
      serve_frontend_assets('/index.html', response)
    else
      serve_frontend_assets(request.path, response)
    end
  end

  def serve_homebrew_svg(response)
    response['Content-Type'] = 'image/svg+xml'
    response.body = URI.open('https://upload.wikimedia.org/wikipedia/commons/9/95/Homebrew_logo.svg').read
  end

  def serve_frontend_assets(path, response)
    URI.open(@options[:app_url] + path) do |proxy|
      response['Content-Type'] = determine_content_type(path, proxy.content_type)
      response.body = proxy.read
    end
  end

  def determine_content_type(path, type)
    if type == 'text/plain'
      case File.extname(path)
      when '.js' then 'application/javascript'
      when '.css' then 'text/css'
      else 'text/html'
      end
    else
      type
    end
  end
end
