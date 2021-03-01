"use strict";
var assert = require("assert");
var fs = require("fs");
var MarkdownIt = require("markdown-it");
var markdownItAnchor = require("markdown-it-anchor");
var markdownItTOC = require("../../index");

// Defaults
var defaultContainerClass = "table-of-contents";
var defaultMarker = "[[toc]]";
var defaultListType = "ul";
var defaultHeading1 = "Sub heading 1";

// Fixtures
var simpleMarkdown = fs.readFileSync("test/fixtures/simple.md", "utf-8");
var simpleDefaultHTML = fs.readFileSync("test/fixtures/simple-default.html", "utf-8");
var simple1LevelHTML = fs.readFileSync("test/fixtures/simple-1-level.html", "utf-8");
var simpleWithAnchorsHTML = fs.readFileSync("test/fixtures/simple-with-anchors.html", "utf-8");
var simpleWithHeaderFooterHTML = fs.readFileSync("test/fixtures/simple-with-header-footer.html", "utf-8");
var simpleWithTransformLink = fs.readFileSync("test/fixtures/simple-with-transform-link.html", "utf-8");
var emptyMarkdown = defaultMarker;
var emptyMarkdownHtml = fs.readFileSync("test/fixtures/empty.html", "utf-8");
var fullTocSampleMarkdown = fs.readFileSync("test/fixtures/full-toc-sample.md", "utf-8");
var fullTocSampleHtml = fs.readFileSync("test/fixtures/full-toc-sample-result.html", "utf-8");

const slugify = (s) => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'));

describe("Testing Markdown rendering", function() {
  var md = new MarkdownIt();

  it("Parses correctly with default settings", function(done) {
    md.use(markdownItTOC);
    assert.equal(md.render(simpleMarkdown), simpleDefaultHTML);
    done();
  });

  it("Parses correctly with includeLevel set", function(done) {
    md.use(markdownItTOC, {
      "includeLevel": [2]
    });
    assert.equal(md.render(simpleMarkdown), simple1LevelHTML);
    done();
  });

  it("Parses correctly with containerClass set", function(done) {
    var customContainerClass = "custom-container-class";
    md.use(markdownItTOC, {
      "containerClass": customContainerClass
    });
    assert.equal(md.render(simpleMarkdown), simpleDefaultHTML.replace(defaultContainerClass, customContainerClass));
    done();
  });

  it("Parses correctly with markerPattern set", function(done) {
    var customMarker = "[[custom-marker]]";
    md.use(markdownItTOC, {
      "markerPattern": /^\[\[custom-marker\]\]/im
    });
    assert.equal(md.render(simpleMarkdown.replace(defaultMarker, customMarker)), simpleDefaultHTML);
    done();
  });

  it("Parses correctly with listType set", function(done) {
    var customListType = "ol";
    md.use(markdownItTOC, {
      "listType": customListType
    });
    assert.equal(md.render(simpleMarkdown), simpleDefaultHTML.replace(new RegExp(defaultListType, "g"), customListType));
    done();
  });

  it("Parses correctly with custom formatting", function(done) {
    var customHeading = "Test";
    md.use(markdownItTOC, {
      "format": function(str) {
        if (str === defaultHeading1) {
          return customHeading;
        }
        return str;
      }
    });
    assert.equal(md.render(simpleMarkdown), simpleDefaultHTML.replace(defaultHeading1, customHeading));
    done();
  });

  it("Slugs matches markdown-it-anchor", function(done) {
    md.use(markdownItAnchor);
    md.use(markdownItTOC);
    assert.equal(md.render(simpleMarkdown), simpleWithAnchorsHTML);
    done();
  });

  it("Generates empty TOC", function(done) {
    md.use(markdownItTOC);
    assert.equal(md.render(emptyMarkdown), emptyMarkdownHtml);
    done();
  });

  it("Generates full TOC, even when there is a greater header than the first header", function (done) {
    md.use(markdownItTOC, { forceFullToc: true });
    assert.equal(md.render(fullTocSampleMarkdown), fullTocSampleHtml);
    done();
  });

  it("Parses correctly with container header and footer html set", function (done) {
    md.use(markdownItTOC, 
      { 
        slugify,
        containerHeaderHtml: `<div class="header">Contents</div>`,
        containerFooterHtml: `<div class="footer">Footer</div>`, 
      });
    assert.equal(md.render(simpleMarkdown), simpleWithHeaderFooterHTML);
    done();
  });

  it("Generates TOC, with custom transformed link", function (done) {
    md.use(markdownItTOC, 
      { 
        slugify,
        transformLink: (href) => {
          return href+"&type=test";
        },
      });
    assert.equal(md.render(simpleMarkdown), simpleWithTransformLink);
    done();
  });
});
