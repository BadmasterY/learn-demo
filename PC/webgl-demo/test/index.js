import component from 'common/component'

let app = component()

app.scene.scenarios = function (images, models) {
  console.log(app)
  // Volcano
  var volcano = models.Volcano.deepClone()
  volcano.setAll({
    sca: 35,
    name: 'volcano',
    showName: 'volcano'
  })
  app.scene.addObj(volcano)
  app.tooltip.add(volcano)

  // Point
  var point = app.point.addPoint({
    pos:[0, 25, 15]
  })
  point.clickFn = function(obj){
    console.log(obj === this)
    app.scene.camera.moveCameraFocus({
      pos: [0, 76, 134],
      target: [0, 10, 0],
      time: 2000,
      onStart: function(){
        app.processing.renderPass.enabled = false
        app.scene.isRender = false
        if(app.scene.getObjectByName('volcano')){
          app.scene.removeObj(volcano)
        }else{
          app.scene.addObj(volcano)
        }
      },
      onComplete: function(){
        app.processing.renderPass.enabled = true
        app.scene.isRender = true
      }
    })
  }
  
}

app.scene.loopFn = function () {}
 