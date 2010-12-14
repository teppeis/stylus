
/*!
 * CSS - Compiler
 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Visitor = require('./');

/**
 * Initialize a new `Compiler` with the given `root` Node.
 *
 * @param {Node} root
 * @api private
 */

var Compiler = module.exports = function Compiler(root) {
  Visitor.call(this, root);
};

/**
 * Inherit from `Visitor.prototype`.
 */

Compiler.prototype.__proto__ = Visitor.prototype;

/**
 * Compile to css, and callback `fn(err, css)`.
 *
 * @param {Function} fn
 * @api public
 */

Compiler.prototype.compile = function(fn){
  this.indents = 1;
  this.callback = fn;
  this.css = this.visit(this.root);
  fn(null, this.css);
};

/**
 * Return indentation string.
 *
 * @return {String}
 * @api private
 */

Compiler.prototype.__defineGetter__('indent', function(){
  return new Array(this.indents).join('  ');
});

/**
 * Visit Root.
 */

Compiler.prototype.visitRoot = function(block){
  var arr = [];
  for (var i = 0, len = block.nodes.length; i < len; ++i) {
    arr.push(this.visit(block.nodes[i]));
  }
  return arr.join('\n');
};

/**
 * Visit Block.
 */

Compiler.prototype.visitBlock = function(block){
  var arr = [' {'];
  ++this.indents;
  for (var i = 0, len = block.nodes.length; i < len; ++i) {
    arr.push(this.visit(block.nodes[i]));
  }
  --this.indents;
  arr.push('}');
  return arr.join('\n');
};

/**
 * Visit Variable.
 */

Compiler.prototype.visitVariable = function(variable){
  return '';
};

/**
 * Visit Color.
 */

Compiler.prototype.visitColor = function(color){
  return color.toString();
};

/**
 * Visit Unit.
 */

Compiler.prototype.visitUnit = function(unit){
  return unit.val + unit.type;
};

/**
 * Visit Selector.
 */

Compiler.prototype.visitSelector = function(selector){
  return selector.val + this.visit(selector.block);
};

/**
 * Visit Property.
 */

Compiler.prototype.visitProperty = function(prop){
  return this.indent + prop.name + ': ' + this.visit(prop.val) + ';';
};