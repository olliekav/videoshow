var ffmpeg = require('fluent-ffmpeg')
var options = require('./options')

module.exports = video

function video(image, params, output) {
  var video = ffmpeg(image.path)
  params = options.define(params)

  if (image.loop) {
    params.loop = image.loop
  }

  options.applyVideo(video, params)

  if (image.filters) {
    video.videoFilters(image.filters)
  }

  if ((params.transition && image.transition !== false) || image.transition) {
    video.videoFilters(transitionFilter(image, params))
  }

  video.save(output)

  return video
}

function transitionFilter(image, params) {
  var options = []
  var duration = image.transitionDuration || params.transitionDuration
  var color = image.transitionColor || params.transitionColor
  var loop = image.loop || params.loop
  var transitionBlend = image.transitionBlend || params.transitionBlend
  
  if (transitionBlend) {
    var blend = "blend=all_expr='A_(if(gte(T,0.5),1,T/0.5))+B_(1-(if(gte(T,0.5),1,T/0.5)))'"
     options.push(blend)
  } else {
    if (!image.disableFadeIn) {
      options.push('fade=t=in:st=0:d=' + duration + ':color=' + color)
    }
    if (!image.disableFadeOut) {
      options.push('fade=out:st=' + (loop - duration) + ':d=' + duration + ':color=' + color)
    }  
  }

  return options
}
