var earth = d3.select('.earth')
window.onresize = createEarth
createEarth()

function createEarth () {
  earth.selectAll('*').remove()

  var width = window.innerWidth
  var height = window.innerHeight

  var projection = d3.geo.orthographic()
      .precision(0)
      .scale(500)
      .translate([width / 2, height / 2])
      .clipAngle(180)

  var canvas = d3.select('.earth').append('canvas')
      .attr('width', width)
      .attr('height', height)

  var context = canvas.node().getContext('2d')

  var path = d3.geo.path()
      .projection(projection)
      .context(context)

  var delta = 0
  var offset = 0

  d3.json('world-110m.json', function(error, world) {
    var x = 0
    var y = 0

    window.onscroll = function () {
      y = (window.pageYOffset || document.scrollTop)  - (document.clientTop || 0) || 0
      rotate()
    }

    d3.select('body').on('mousemove', function () {
      x = d3.mouse(this)[0]
      rotate()
    })

    var land = topojson.feature(world, world.objects.land)
    var countries = topojson.feature(world, world.objects.countries).features

    countries.map(function (country) {
      country.properties.color = Math.random()
    })
    rotate()

    function rotate () {
      projection.rotate([x * .1, y * .1, 30])
      context.clearRect(0, 0, width, height)

      countries.map(function (country) {
        context.beginPath()
        context.strokeStyle = d3.hsl(country.properties.color * x, 1, .8).toString()
        path(country)
        context.stroke()
      })
    }
  })
}
