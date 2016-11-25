use Rack::Static,
  :urls => ["/data", "/img", "/js"],
  :root => "src"

run lambda { |env|
  [
    200,
    {
      'Content-Type'  => 'text/html'
    },
    File.open('src/air-quality-mk.html', File::RDONLY)
  ]
}