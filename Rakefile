require 'fileutils'
require 'json'

VERSION = File.read('VERSION').strip.sub(/^v/, '')
raise 'Invalid version format should be x.y.z' unless VERSION =~ /\d+\.\d+\.\d+$/

task default: :build

desc 'Build all'
task build: [:update_version, :production, :build_frontend]

desc 'Build production executable'
task :production do
  puts 'Building production executable...'

  # Read main file
  content = File.read('brewiz')

  # Remove development requires and commands
  content.gsub!(/^.*# DEVELOPMENT ONLY.*$\n/, '')
  content.gsub!(/DevCommand\.new\.run.*$/, 'Command.new.run(ARGV)')

  # Inline all library files from require statements
  content.scan(/^require_relative ['"]lib\/(.+?)['"]$/).each do |match|
    library = match[0]
    file_path = "lib/#{library}.rb"

    if File.exist?(file_path)
      require_line = "require_relative 'lib/#{library}'"
      content.gsub!(/^#{Regexp.escape(require_line)}$/, File.read(file_path))
    end
  end

  # Write production file
  output_path = 'bin/brewiz'
  File.write(output_path, content)
  FileUtils.chmod(0755, output_path)

  puts "Build complete: #{output_path}"
end

desc 'Update version in files'
task :update_version do
  puts "Updating version to v#{VERSION}..."

  puts 'Updating app/package.json files...'
  app_package = JSON.parse(File.read('app/package.json'))
  app_package['version'] = VERSION
  File.write('app/package.json', JSON.pretty_generate(app_package) + "\n")

  puts 'Updating brewiz file...'
  brewiz_content = File.read('brewiz')
  brewiz_content.gsub!(/^VERSION = ['"].*?['"]$/, "VERSION = '#{VERSION}'")
  File.write('brewiz', brewiz_content)

  puts 'Updating README.md...'
  readme_content = File.read('README.md')
  # replace version-0.9.3
  readme_content.gsub!(/version-\d+\.\d+\.\d+/, "version-#{VERSION}")
  File.write('README.md', readme_content)
end

desc 'Build Solid.js frontend'
task :build_frontend do
  puts 'Building frontend...'
  system('cd app && npm run build') or raise 'Frontend build failed'
  puts 'Frontend build complete'
end

desc 'Clean build artifacts'
task :clean do
  FileUtils.rm_rf(Dir.glob(['bin/*', 'app/dist/*']))
end

desc 'Publish new release'
task :publish do
  puts "Publishing version #{VERSION}..."

  # Check if working directory is clean
  raise 'Working directory is not clean' unless system('git diff-index --quiet HEAD --')

if system("git rev-parse -q --verify refs/tags/v#{VERSION} > /dev/null 2>&1")
  if `git rev-parse HEAD`.strip != `git rev-parse v#{VERSION}`.strip
    raise "Tag v#{VERSION} already exists at a different commit, you need to unpublish first to publish again!"
  end
  puts "Tag v#{VERSION} already exists at HEAD, skipping tag creation"
else
  raise "Failed to create tag v#{VERSION}" unless system("git tag v#{VERSION}")
end

  system('git push origin') or raise 'Failed to push to origin'
  system("git push origin v#{VERSION}") or raise "Failed to push tag v#{VERSION}"

  puts "Successfully published v#{VERSION}"
end

desc 'Unpublish current release'
task :unpublish do
  puts "Unpublishing version #{VERSION}..."

  # Delete local tag
  system("git tag -d v#{VERSION}") or raise 'Failed to delete local tag'

  # Delete remote tag
  system("git push origin :refs/tags/v#{VERSION}") or raise 'Failed to delete remote tag'

  puts "Successfully unpublished v#{VERSION}"
end

desc 'Install dependencies'
task :install do
  puts 'Installing Gem dependencies...'
  system('bundle install') or raise 'Failed to install Gem dependencies'
  puts 'Installing Node.JS dependencies...'
  system('cd app && npm install') or raise 'Failed to install app dependencies'
  puts 'Dependencies installed'
end

desc 'Start development mode'
task :dev do
  puts 'Starting development environment...'

  # Run frontend development server
  pid = Process.spawn('npm run dev', chdir: File.expand_path('../app', __FILE__))

  at_exit do
    puts 'Shutting down development environment pid: ' + pid.to_s
    Process.kill('TERM', pid) rescue nil
  end
  sleep 1
  system('ruby brewiz --dev --packages=data/packages.yaml --access --cache') or raise 'Brewiz execution failed'
end
