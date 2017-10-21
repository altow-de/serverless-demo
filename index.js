exports.myFunc = function (event, context, callback) {
  console.log("hi, it is me")
  context.succeed({ hello: "is it me you're looking for?" })
}
