use Rack::Static,
  :urls => ["/data"],
  :root => "src"

run lambda { |env|
  [
    200,
    {
      'Content-Type'  => 'text/html',
      'Cache-Control' => 'public, max-age=86400'
    },
    File.open('src/air-quality-mk.html', File::RDONLY)
  ]
}