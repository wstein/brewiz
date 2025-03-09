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
  puts "Updating version to v#{VERSION}..."
  puts 'Updating package.json...'
  package = JSON.parse(File.read('package.json'))
  package['version'] = VERSION
  File.write('package.json', JSON.pretty_generate(package) + "\n")

  puts 'Updating brewiz file...'
  brewiz_content = File.read('brewiz')
  brewiz_content.gsub!(/^VERSION = ['"].*?['"]$/, "VERSION = '#{VERSION}'")
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

desc 'Publish release'
task :publish do
  puts "Publishing version #{VERSION}..."

  # Check if working directory is clean
  raise 'Working directory is not clean' unless system('git diff-index --quiet HEAD --')

  # Create and push tag
  system("git tag v#{VERSION}") or raise "Failed to create tag v#{VERSION}"
  system('git push origin v#{VERSION}') or raise "Failed to push tag v#{VERSION}"

  puts "Successfully published v#{VERSION}"
end

desc 'Unpublish release'
task :unpublish do
  puts "Unpublishing version #{VERSION}..."

  # Delete local tag
  system("git tag -d v#{VERSION}") or raise 'Failed to delete local tag'

  # Delete remote tag
  system("git push origin :refs/tags/v#{VERSION}") or raise 'Failed to delete remote tag'

  puts "Successfully unpublished v#{VERSION}"
end
