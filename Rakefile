require 'fileutils'
require 'json'

task default: :build

desc 'Build all'
task build: [:production, :update_version, :build_frontend]

desc 'Build production executable'
task :production do
  puts 'Building production executable...'

  # Create dist directory
  FileUtils.mkdir_p('dist')

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

desc 'Update version'
task :update_version do
  version = File.read('VERSION').strip.sub(/^v/, '')
  raise 'Invalid version format should be x.y.z' unless version =~ /\d+\.\d+\.\d+$/

  puts "Updating version to #{version}..."
  puts 'Updating package.json...'
  package = JSON.parse(File.read('package.json'))
  package['version'] = version
  File.write('package.json', JSON.pretty_generate(package) + "\n")

  puts 'Updating brewiz file...'
  brewiz_content = File.read('brewiz')
  brewiz_content.gsub!(/^VERSION = ['"].*?['"]$/, "VERSION = '#{version}'")
  File.write('brewiz', brewiz_content)

end

desc 'Build frontend'
task :build_frontend do
  puts 'Building frontend...'
  system('npm run build') or raise 'Frontend build failed'
  puts 'Frontend build complete'
end

desc 'Clean build artifacts'
task :clean do
  FileUtils.rm_rf('dist')
end
