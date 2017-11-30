define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var lang = require("../lib/lang");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var DocCommentHighlightRules = require("./doc_comment_highlight_rules").DocCommentHighlightRules;
var JSHighlightRules = require("./javascript_highlight_rules").JavaScriptHighlightRules;
var JsonHighlightRules = require("./json_highlight_rules").JsonHighlightRules;
var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;
var XmlHighlightRules = require("./xml_highlight_rules").XmlHighlightRules;
var CsvHighlightRules = require("./csv_highlight_rules").CsvHighlightRules;
var DotHighlightRules = require("./dot_highlight_rules").DotHighlightRules;

var DpsHighlightRules = function() {

   var keywords = lang.arrayToMap(
        ("strict|node|edge|graph|digraph|subgraph").split("|")
   );

   var attributes = lang.arrayToMap(
        ("damping|k|url|area|arrowhead|arrowsize|arrowtail|aspect|bb|bgcolor|center|charset|clusterrank|color|colorscheme|comment|compound|concentrate|constraint|decorate|defaultdist|dim|dimen|dir|diredgeconstraints|distortion|dpi|edgeurl|edgehref|edgetarget|edgetooltip|epsilon|esep|fillcolor|fixedsize|fontcolor|fontname|fontnames|fontpath|fontsize|forcelabels|gradientangle|group|headurl|head_lp|headclip|headhref|headlabel|headport|headtarget|headtooltip|height|href|id|image|imagepath|imagescale|label|labelurl|label_scheme|labelangle|labeldistance|labelfloat|labelfontcolor|labelfontname|labelfontsize|labelhref|labeljust|labelloc|labeltarget|labeltooltip|landscape|layer|layerlistsep|layers|layerselect|layersep|layout|len|levels|levelsgap|lhead|lheight|lp|ltail|lwidth|margin|maxiter|mclimit|mindist|minlen|mode|model|mosek|nodesep|nojustify|normalize|nslimit|nslimit1|ordering|orientation|outputorder|overlap|overlap_scaling|pack|packmode|pad|page|pagedir|pencolor|penwidth|peripheries|pin|pos|quadtree|quantum|rank|rankdir|ranksep|ratio|rects|regular|remincross|repulsiveforce|resolution|root|rotate|rotation|samehead|sametail|samplepoints|scale|searchsize|sep|shape|shapefile|showboxes|sides|size|skew|smoothing|sortv|splines|start|style|stylesheet|tailurl|tail_lp|tailclip|tailhref|taillabel|tailport|tailtarget|tailtooltip|target|tooltip|truecolor|vertices|viewport|voro_margin|weight|width|xlabel|xlp|z").split("|")
   );

   this.$rules = {
        "start" : [
            {
                token : "comment",
                regex : /\/\/.*$/
            }, {
                token : "comment",
                regex : /#.*$/
            }, {
                token : "comment", // multi line comment
                merge : true,
                regex : /\/\*/,
                next : "comment"
            }, {
                token : "string",
                regex : "'(?=.)",
                next  : "qstring"
            }, {
                token : "string",
                regex : '"(?=.)',
                next  : "qqstring"
            }, {
                token : "constant.numeric",
                regex : /[+\-]?\d+(?:(?:\.\d*)?(?:[eE][+\-]?\d+)?)?\b/
            }, {
                token : "keyword.operator",
                regex : /\+|=|\->/
            }, {
                token : "punctuation.operator",
                regex : /,|;/
            }, {
                token : "paren.lparen",
                regex : /[\[]/
            }, {
                token : "paren.rparen",
                regex : /[\]]/
            }, {
                token: "comment",
                regex: /^#!.*$/
            }, {
                token: "meta.tag",
                regex: "(\\-?@[a-zA-Z_][a-zA-Z0-9_\\-]*[\\W\\s]*)(?=\\()"
            }, {
                token: "keyword",
                regex: "(\\-?[a-zA-Z_][a-zA-Z0-9_\\-]*[\\W\\s]*)(?=\\()"
            }, {
                token: "variable",
                regex: "(\\-?[a-zA-Z_][a-zA-Z0-9_\\-]*[\\W\\s]*)(?=\\:)"
            }, {
                token: "storage",
                regex: "{{(\\-?[a-zA-Z_][a-zA-Z0-9_\\-\\.\\[\\]]*)}}"
            }, {
                token: "meta.tag",
                regex: "\\?>"
            },
            {
                token: "meta.tag",
                regex: /<\?dps?/
            }
        ],
        "comment" : [
            {
                token : "comment", // closing comment
                regex : ".*?\\*\\/",
                merge : true,
                next : "start"
            }, {
                token : "comment", // comment spanning whole line
                merge : true,
                regex : ".+"
            }
        ],
        "qqstring" : [
            {
                token : "string",
                regex : '[^"\\\\]+',
                merge : true
            }, {
                token : "string",
                regex : "\\\\$",
                next  : "qqstring",
                merge : true
            }, {
                token : "string",
                regex : '"|$',
                next  : "start",
                merge : true
            }
        ],
        "qstring" : [
            {
                token : "string",
                regex : "[^'\\\\]+",
                merge : true
            }, {
                token : "string",
                regex : "\\\\$",
                next  : "qstring",
                merge : true
            }, {
                token : "string",
                regex : "'|$",
                next  : "start",
                merge : true
            }
        ]
   };

   var startRules = [
        // {
        //     token: "meta.tag",
        //     regex: /<\?js?/,
        //     push: "javascript-start"
        // },
        {
            token: "meta.tag",
            regex: /<\?javascript?/,
            push: "javascript-start"
        },
        {
            token: "meta.tag",
            regex: /<\?json?/,
            push: "json-start"
        },
        {
            token: "meta.tag",
            regex: /<\?text?/,
            push: "text-start"
        },
        {
            token: "meta.tag",
            regex: /<\?html?/,
            push: "html-start"
        },
        {
            token: "meta.tag",
            regex: /<\?xml?/,
            push: "xml-start"
        },
        {
            token: "meta.tag",
            regex: /<\?csv?/,
            push: "csv-start"
        },
        {
            token: "meta.tag",
            regex: /<\?dot?/,
            push: "dot-start"
        },
        {
            token: "meta.tag",
            regex: /<\?viz?/,
            push: "dot-start"
        },
        {
            token: "meta.tag",
            regex: /<\?graph?/,
            push: "dot-start"
        },
        {
            token: "meta.tag",
            regex: /<\?chart?/,
            push: "dot-start"
        }
    ];

    var endRules = [
        {
            token: "meta.tag",
            regex: "\\?>",
            next: "pop"
        }
    ];

    this.embedRules(JSHighlightRules, "javascript-", endRules, ["start"]);
    this.embedRules(JsonHighlightRules, "json-", endRules, ["start"]);
    this.embedRules(HtmlHighlightRules, "html-", endRules, ["start"]);
    this.embedRules(XmlHighlightRules, "xml-", endRules, ["start"]);
    this.embedRules(CsvHighlightRules, "csv-", endRules, ["start"]);
    this.embedRules(DotHighlightRules, "dot-", endRules, ["start"]);

    for (var key in this.$rules)
        this.$rules[key].unshift.apply(this.$rules[key], startRules);

    this.normalizeRules();
};

oop.inherits(DpsHighlightRules, TextHighlightRules);

exports.DpsHighlightRules = DpsHighlightRules;

});
