function templates(req, res) {
  var name = req.params.name;
  res.render('templates/' + name);
}

module.exports.templates = templates;
