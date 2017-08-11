
function deleteModel(path, id) {
  $('#my-confirm').modal({
    relatedTarget: this,
    onConfirm: function (options) {
      window.location.href = `/admin/${path}/delete?id=${id}`
    },
    // closeOnConfirm: false,
    onCancel: function () {
      
    }
  })
}

function changePage(path){
  window.location.href = path
}
