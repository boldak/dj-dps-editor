define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var JSMode = require("./javascript").Mode;
var JsonMode = require("./json").Mode;
var HtmlMode = require("./html").Mode;
var XmlMode = require("./xml").Mode;
var CsvMode = require("./csv").Mode;

var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
var DPSCoreHighlightRules = require("./dpscore_highlight_rules").DPSCoreHighlightRules;
var DPSCoreFoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = DPSCoreHighlightRules;
    this.$outdent = new MatchingBraceOutdent();
    this.foldingRules = new DPSCoreFoldMode();
    this.$behaviour = this.$defaultBehaviour;
    this.createModeDelegates({
        "javascript-": JSMode,
        "json-": JsonMode,
        "html-": HtmlMode,
        "xml-": XmlMode,
        "csv-": CsvMode 
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

    this.$id = "ace/mode/dpscore";
}).call(Mode.prototype);

exports.Mode = Mode;
});
