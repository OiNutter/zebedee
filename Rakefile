require 'rake'
require 'rake/packagetask'
require 'yaml'

ROOT_DIR = File.expand_path(File.dirname(__FILE__))
SRC_DIR = File.join(ROOT_DIR, 'src')
DIST_DIR = File.join(ROOT_DIR,'dist')

DEBUG_DIR   = File.join(DIST_DIR, 'debug')
RELEASE_DIR = File.join(DIST_DIR, 'release')

DOCUMENTATION_DIR  = File.join(ROOT_DIR, 'doc')
PKG_DIR  = File.join(ROOT_DIR, 'pkg')

VERSION  = YAML.load(IO.read(File.join(SRC_DIR, 'constants.yml')))['VERSION']

TEST_DIR      = File.join(ROOT_DIR, 'test')
TEST_UNIT_DIR = File.join(TEST_DIR, 'unit')
TMP_DIR       = File.join(TEST_UNIT_DIR, 'tmp')

DOC_TEMPLATES_ROOT = File.join(ROOT_DIR, "templates")
DOC_TEMPLATES_DIR = File.join(DOC_TEMPLATES_ROOT, "html")

$:.unshift File.join(ROOT_DIR, 'vendor', 'sprockets', 'lib')

def sprocketize(path, source, destination=nil)
  destination ||= [*source].first
  begin
    require "sprockets"
  rescue LoadError => e
    puts "\nzebedee requires Sprockets to build the files. Just run:\n\n"
    puts "  $ git submodule init"
    puts "  $ git submodule update"
    puts "\nto pull in the necessary submodules.\n\n"
  end
  
  puts "Sprocketizing (#{[*source].join(', ')})..."
  secretary = Sprockets::Secretary.new(
    :root         => File.join(ROOT_DIR, path),
    :load_path    => [SRC_DIR],
    :source_files => [*source]
  )
  
  secretary.concatenation.save_to(File.join(DIST_DIR, destination))
end

task :default => [:clean, :dist, :unified, :doc, :package, :clean_package_source]

desc "Clean the distribution directory."
task :clean do 
  rm_rf DIST_DIR
  mkdir DIST_DIR
  mkdir DEBUG_DIR
  mkdir RELEASE_DIR
end

def dist_from_sources(source)
 
  sprocketize("src", source)
   
end

desc "Builds the distribution."
task :dist => ['dist:default']
namespace :dist do
  
  task :default => ['dist:zepto']
   
  task :zepto do
    mkdir File.join(DIST_DIR,'zepto')
    mkdir File.join(RELEASE_DIR,'zepto')
    dist_from_sources(['zepto/zebedee.js'])
    cp File.join(ROOT_DIR,'lib','zepto.js'), File.join(DIST_DIR,'zepto','zepto.js')
  end
  
end

def minify(src, target, compressor = 'yui')
  puts "Minifying #{src}..."
  if compressor == 'yui'
    `java -jar vendor/yuicompressor/yuicompressor-2.4.2.jar #{src} -o #{target}`
  elsif compressor == 'google'
    `java -jar vendor/google-compiler/compiler.jar --js #{src} --summary_detail_level 3 --js_output_file #{target}`
  end
  cp target, File.join(DEBUG_DIR,'temp.js')
  msize = File.size(File.join(DEBUG_DIR,'temp.js'))
  `gzip -9 #{File.join(DEBUG_DIR,'temp.js')}`
  
  osize = File.size(src)
  dsize = File.size(File.join(DEBUG_DIR,'temp.js.gz'))
  rm_rf File.join(DEBUG_DIR,'temp.js.gz')
  
  puts "Original version: %.1fk" % (osize/1024.0)
  puts "Minified: %.1fk" % (msize/1024.0)
  puts "Minified and gzipped: %.1fk, compression factor %.1f" % [dsize/1024.0, osize/dsize.to_f]  
end

desc "Generates a minified version of the distribution (using YUI Compressor)."
task :min => ['min:default']
namespace :min do
  
   task :default => ['min:zepto']
  
   task :zepto do
      minify File.join(DIST_DIR,'zepto','zebedee.js'), File.join(RELEASE_DIR,'zepto','zebedee.min.js')
      minify File.join(ROOT_DIR,'lib','zepto.js'), File.join(RELEASE_DIR,'zepto','zepto.min.js')
   end
end

desc "Generates a minified version of the distribution (using Google Closure Compiler)."
task :min_google => ['min_google:default']
namespace :min_google do 
  task :default => ['min_google:zepto']
  
  task :zepto do
      minify File.join(DIST_DIR,'zepto','zebedee.js'), File.join(RELEASE_DIR,'zepto','zebedee.min.js'), 'google'
      minify File.join(ROOT_DIR,'lib','zepto.js'), File.join(RELEASE_DIR,'zepto','zepto.min.js'), 'google'
  end
end

def unify_distribution(sources,output)
  unified = ''
  for file in sources do
    unified += IO.read(file)
  end
  
  File.open(File.join(DIST_DIR,output), 'w') do |file|
    file.write unified
  end 
  minify File.join(DIST_DIR,output), File.join(RELEASE_DIR,output.gsub('.js','.min.js')), 'google'
end

desc "Generate a unified minified version of zebedee"
task :unified => ['unified:default']
namespace :unified do
  
  task :default => ['unified:zepto']
  
  task :zepto => [:dist, :min_google] do
    unify_distribution [File.join(DIST_DIR,'zepto','zepto.js'),File.join(DIST_DIR,'zepto','zebedee.js')], 'zepto/zepto.zebedee.js' 
  end

end

def doc_from_sources(sources)
  
  require 'tempfile'
  begin
    require "sprockets"
  rescue LoadError => e
    puts "\nzebedee requires Sprockets to build the files. Just run:\n\n"
    puts "  $ git submodule init"
    puts "  $ git submodule update"
    puts "\nto pull in the necessary submodules.\n\n"
  end
  
  Tempfile.open("pdoc") do |temp|
    secretary = Sprockets::Secretary.new(
      :root           => File.join(ROOT_DIR, "src"),
      :load_path      => [SRC_DIR],
      :source_files   => sources,
      :strip_comments => false
    )
      
    secretary.concatenation.save_to(temp.path)
    rm_rf DOCUMENTATION_DIR
    mkdir DOCUMENTATION_DIR
    
    #begin
      PDoc::Runner.new(temp.path,
        :destination    => DOCUMENTATION_DIR
      ).run
    #rescue 
     # puts "\n\nEXCEPTION WHILE RUNNING PDOC, CONTINUING...\n\n"
    #end
  end
  
  cp File.join(ROOT_DIR, 'lib', 'zepto.js'), File.join(DOCUMENTATION_DIR, 'javascripts','zepto')
  cp File.join(DIST_DIR,'zepto','zebedee.js'), File.join(DOCUMENTATION_DIR,'javascripts','zepto')
end

namespace :doc do
  desc "Builds the documentation."
  task :build => [:require] do
    doc_from_sources(["zepto/zebedee.js"])
  end
  
  task :require do
    lib = 'vendor/pdoc/lib/pdoc'
    unless File.exists?(lib)
     puts "\nzebedee requires pDoc to build the documentation. Just run:\n\n"
     puts "  $ git submodule init"
     puts "  $ git submodule update"
     puts "\nto pull in the necessary submodules.\n\n"
    end
    require File.join(ROOT_DIR,lib)
  end
  
end

task :doc => ['doc:build']

Rake::PackageTask.new('zebedee', VERSION) do |package|
  package.need_tar_gz = true
  package.need_zip = true
  package.package_dir = PKG_DIR
  package.package_files.include(
    'README.md',
    'BSD-LICENSE',
    'dist/**/*',
    'doc/**/*',
    'src/**/*'
  )
end

task :clean_package_source do
  rm_rf File.join(PKG_DIR, "zebedee-#{VERSION}")
end

task :test => ['test:build', 'test:run']
namespace :test do
  desc 'Runs all the JavaScript unit tests and collects the results'
  task :run => [:require] do
    testcases        = ENV['TESTCASES']
    browsers_to_test = ENV['BROWSERS'] && ENV['BROWSERS'].split(',')
    tests_to_run     = ENV['TESTS'] && ENV['TESTS'].split(',')
    runner           = UnittestJS::WEBrickRunner::Runner.new(:test_dir => TMP_DIR)

    Dir[File.join(TMP_DIR, '*_test.html')].each do |file|
      file = File.basename(file)
      test = file.sub('_test.html', '')
      unless tests_to_run && !tests_to_run.include?(test)
        runner.add_test(file, testcases)
      end
    end
    
    UnittestJS::Browser::SUPPORTED.each do |browser|
      unless browsers_to_test && !browsers_to_test.include?(browser)
        runner.add_browser(browser.to_sym)
      end
    end
    
    trap('INT') { runner.teardown; exit }
    runner.run
  end
  
  task :build => [:clean, :dist] do
    builder = UnittestJS::Builder::SuiteBuilder.new({
      :input_dir  => TEST_UNIT_DIR,
      :assets_dir => DIST_DIR
    })
    selected_tests = (ENV['TESTS'] || '').split(',')
    builder.collect(*selected_tests)
    builder.render
    
    # override UnittestJS stuff
    cp File.join(ROOT_DIR, 'lib', 'prototype.1.7.0.js'),
      File.join(TMP_DIR, 'lib_assets', 'prototype.1.7.0.js')
      
     cp File.join(ROOT_DIR, 'lib', 'raphael.1.5.2.js'),
      File.join(TMP_DIR, 'lib_assets', 'prototype.1.5.2.js')
  end
  
  task :clean => [:require] do
    UnittestJS::Builder.empty_dir!(TMP_DIR)
  end
  
  task :require do
    lib = 'vendor/unittest_js/lib/unittest_js'
    unless File.exists?(lib)
     puts "\nzebedee requires UnittestJS to run the test. Just run:\n\n"
     puts "  $ git submodule init"
     puts "  $ git submodule update"
     puts "\nto pull in the necessary submodules.\n\n"
    end
    require lib
  end
end
