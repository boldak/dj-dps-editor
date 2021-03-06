define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var JSMode = require("./javascript").Mode;
var JsonMode = require("./json").Mode;
var HtmlMode = require("./html").Mode;
var XmlMode = require("./xml").Mode;
var CsvMode = require("./csv").Mode;
var DotMode = require("./dot").Mode;
var CypherMode = require("./cypher").Mode;
var PlantUMLMode = require("./plantuml").Mode;
var MysqlMode = require("./mysql").Mode;
var MarkdownMode = require("./markdown").Mode;


var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
var DpsHighlightRules = require("./dps_highlight_rules").DpsHighlightRules;
var DpsFoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = DpsHighlightRules;
    this.$outdent = new MatchingBraceOutdent();
    this.foldingRules = new DpsFoldMode();
    this.$behaviour = this.$defaultBehaviour;
    this.createModeDelegates({
        "javascript-": JSMode,
        "json-": JsonMode,
        "html-": HtmlMode,
        "xml-": XmlMode,
        "csv-": CsvMode,
        "dot-": DotMode,
        "cypher-": CypherMode,
        "plantuml-": PlantUMLMode,
        "sql-": MysqlMode,
        "md-":MarkdownMode 
    });
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = ["//", "#"];
    this.blockComment = {start: "/*", end: "*/"};

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;
        var endState = tokenizedLine.state;

        if (tokens.length && tokens[tokens.length-1].type == "comment") {
            return indent;
        }

        if (state == "start") {
            var match = line.match(/^.*(?:\bcase\b.*:|[\{\(\[])\s*$/);
            if (match) {
                indent += tab;
            }
        }

        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };

    this.$id = "ace/mode/dps";
}).call(Mode.prototype);

exports.Mode = Mode;
});
