<template>
  <div id="sample">
    <div id="myDiagramDiv" style="background-color: #ddd; border: solid 1px black; height: 570px;"></div>
    <p>
      <button id="zoomToFit">缩放</button>
      <button id="centerRoot">居中</button>
    </p>

    <div>
      <div id="myInspector"></div>
    </div>
    <div>
      <div>
        <button id="SaveButton" @click="save()">JSON格式化</button>
        <button @click="load()">加载</button>
      </div>
      <textarea id="mySavedModel" v-model="dataJsonStr" style="width:100%; height:270px;"></textarea>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataJsonStr: "",
      dataJson: {
        class: "go.TreeModel",
        nodeDataArray: [
          { key: 1, name: "", title: "任务id" },
          { key: 2, name: "", title: "任务状态", parent: 1 },
          { key: 3, name: "", title: "开启年份", parent: 2 },
          { key: 4, name: "", title: "开启日期", parent: 1 },
          { key: 5, name: "", title: "结束年份", parent: 4 },
          { key: 6, name: "", title: "结束日期", parent: 2 },
          { key: 7, name: "", title: "Sales Rep", parent: 3 },
          { key: 8, name: "Les Ismore", title: "Project Mgr", parent: 5 },
          { key: 9, name: "April Lynn Parris", title: "Events Mgr", parent: 6 },
          { key: 10, name: "Xavier Breath", title: "Engineering", parent: 4 },
          { key: 11, name: "Anita Hammer", title: "Process", parent: 5 },
          { key: 12, name: "Billy Aiken", title: "Software", parent: 10 },
          { key: 13, name: "Stan Wellback", title: "Testing", parent: 10 },
          { key: 14, name: "Marge Innovera", title: "Hardware", parent: 10 },
          { key: 15, name: "Evan Elpus", title: "Quality", parent: 5 },
          { key: 16, name: "Lotta B. Essen", title: "Sales Rep", parent: 3 },
        ],
      },
    };
  },
  mounted() {
    const _this = this;
    this.dataJsonStr = JSON.stringify(this.dataJson);
    this.$nextTick(() => {
      _this.initGo();
    });
  },
  methods: {
    initGo() {
      const that = this;
      const MAKE = go.GraphObject.make;
      // if (window.goSamples) goSamples();
      that.myDiagram = MAKE(go.Diagram, "myDiagramDiv", {
        maxSelectionCount: 1,
        validCycle: go.Diagram.CycleDestinationTree,
        "clickCreatingTool.archetypeNodeData": {
          name: "(new person)",
          title: "",
          comments: "",
        },
        "clickCreatingTool.insertPart": function (loc) {
          // scroll to the new node
          var node = go.ClickCreatingTool.prototype.insertPart.call(this, loc);
          if (node !== null) {
            this.diagram.select(node);
            this.diagram.commandHandler.scrollToPart(node);
            this.diagram.commandHandler.editTextBlock(
              node.findObject("NAMETB")
            );
          }
          return node;
        },
        layout: MAKE(go.TreeLayout, {
          treeStyle: go.TreeLayout.StyleLastParents,
          arrangement: go.TreeLayout.ArrangementHorizontal,
          // properties for most of the tree:
          angle: 0,
          layerSpacing: 35,
          // properties for the "last parents":
          alternateAngle: 90,
          alternateLayerSpacing: 35,
          alternateAlignment: go.TreeLayout.AlignmentBus,
          alternateNodeSpacing: 20,
        }),
        "undoManager.isEnabled": true, // enable undo & redo
      });
      // 文档修改后添加所以的内容，点击保存this
      that.myDiagram.addDiagramListener("Modified", function (e) {
        var button = document.getElementById("SaveButton");
        // if (button) button.disabled = !that.myDiagram.isModified;
        var idx = document.title.indexOf("*");
        if (that.myDiagram.isModified) {
          if (idx < 0) document.title += "*";
        } else {
          if (idx >= 0) document.title = document.title.substr(0, idx);
        }
      });
      //删除表单节点
      that.myDiagram.addDiagramListener("SelectionDeleting", function (e) {
        var part = e.subject.first();

        that.myDiagram.startTransaction("clear boss");
        if (part instanceof go.Node) {
          var it = part.findTreeChildrenNodes();
          while (it.next()) {
            var child = it.value;
            var bossText = child.findObject("boss");
            if (bossText === null) return;
            bossText.text = "";
          }
        } else if (part instanceof go.Link) {
          var child = part.toNode;
          var bossText = child.findObject("boss");
          if (bossText === null) return;
          bossText.text = "";
        }
        that.myDiagram.commitTransaction("clear boss");
      });
      var levelColors = [
        "#AC193D",
        "#2672EC",
        "#8C0095",
        "#5133AB",
        "#008299",
        "#D24726",
        "#008A00",
        "#094AB2",
      ];
      //覆盖更改树的没个节点内容
      that.myDiagram.layout.commitNodes = function () {
        go.TreeLayout.prototype.commitNodes.call(that.myDiagram.layout);

        that.myDiagram.layout.network.vertexes.each(function (v) {
          if (v.node) {
            var level = v.level % levelColors.length;
            var color = levelColors[level];
            var shape = v.node.findObject("SHAPE");
            if (shape)
              shape.stroke = MAKE(go.Brush, "Linear", {
                0: color,
                1: go.Brush.lightenBy(color, 0.05),
                start: go.Spot.Left,
                end: go.Spot.Right,
              });
          }
        });
      };

      // define the Node template
      that.myDiagram.nodeTemplate = MAKE(
        go.Node,
        "Auto",
        { doubleClick: this.nodeDoubleClick },
        {
          // handle dragging a Node onto a Node to (maybe) change the reporting relationship
          mouseDragEnter: function (e, node, prev) {
            var diagram = node.diagram;
            var selnode = diagram.selection.first();
            if (!that.mayWorkFor(selnode, node)) return;
            var shape = node.findObject("SHAPE");
            if (shape) {
              shape._prevFill = shape.fill; // remember the original brush
              shape.fill = "#d7d7d7";
            }
          },
          mouseDragLeave: function (e, node, next) {
            var shape = node.findObject("SHAPE");
            if (shape && shape._prevFill) {
              shape.fill = shape._prevFill; // restore the original brush
            }
          },
          mouseDrop: function (e, node) {
            var diagram = node.diagram;
            var selnode = diagram.selection.first(); // assume just one Node in selection
            if (that.mayWorkFor(selnode, node)) {
              // find any existing link into the selected node
              var link = selnode.findTreeParentLink();
              if (link !== null) {
                // reconnect any existing link
                link.fromNode = node;
              } else {
                // else create a new link
                diagram.toolManager.linkingTool.insertLink(
                  node,
                  node.port,
                  selnode,
                  selnode.port
                );
              }
            }
          },
        },
        // for sorting, have the Node.text be the data.name
        new go.Binding("text", "name"),
        // bind the Part.layerName to control the Node's layer depending on whether it isSelected
        new go.Binding("layerName", "isSelected", function (sel) {
          return sel ? "Foreground" : "";
        }).ofObject(),
        // define the node's outer shape
        MAKE(go.Shape, "Rectangle", {
          name: "SHAPE",
          fill: "#F5F5F5",
          stroke: "white",
          strokeWidth: 1.5,

          // set the port properties:
          portId: "",
          fromLinkable: true,
          toLinkable: true,
          cursor: "pointer",
        }),
        MAKE(
          go.Panel,
          "Horizontal",
          MAKE(
            go.Picture,
            {
              name: "Picture",
              desiredSize: new go.Size(70, 70),
              margin: 1.5,
            },
            new go.Binding("source", "key")
          ),
          // define the panel where the text will appear
          MAKE(
            go.Panel,
            "Table",
            {
              minSize: new go.Size(130, NaN),
              maxSize: new go.Size(150, NaN),
              margin: new go.Margin(6, 10, 0, 6),
              defaultAlignment: go.Spot.Left,
            },
            MAKE(go.RowColumnDefinition, { column: 2, width: 4 }),
            MAKE(
              go.TextBlock,
              this.textStyle(), // the name
              {
                row: 0,
                column: 0,
                columnSpan: 5,
                font: "12pt Segoe UI,sans-serif",
                editable: true,
                isMultiline: false,
                minSize: new go.Size(10, 16),
              },
              new go.Binding("text", "name").makeTwoWay()
            ),
            MAKE(go.TextBlock, "Title: ", this.textStyle(), {
              row: 1,
              column: 0,
            }),
            MAKE(
              go.TextBlock,
              this.textStyle(),
              {
                row: 1,
                column: 1,
                columnSpan: 4,
                editable: true,
                isMultiline: false,
                minSize: new go.Size(10, 14),
                margin: new go.Margin(0, 0, 0, 3),
              },
              new go.Binding("text", "title").makeTwoWay()
            ),
            MAKE(
              go.TextBlock,
              this.textStyle(),
              { row: 2, column: 0 },
              new go.Binding("text", "key", function (v) {
                return "ID: " + v;
              })
            ),
            MAKE(
              go.TextBlock,
              this.textStyle(),
              { name: "boss", row: 2, column: 3 }, // we include a name so we can access this TextBlock when deleting Nodes/Links
              new go.Binding("text", "parent", function (v) {
                return "Boss: " + v;
              })
            ),
            MAKE(
              go.TextBlock,
              this.textStyle(), // the comments
              {
                row: 3,
                column: 0,
                columnSpan: 5,
                font: "italic 9pt sans-serif",
                wrap: go.TextBlock.WrapFit,
                editable: true, // by default newlines are allowed
                minSize: new go.Size(10, 14),
              },
              new go.Binding("text", "comments").makeTwoWay()
            )
          ) // end Table Panel
        ) // end Horizontal Panel
      ); // end Node

      // the context menu allows users to make a position vacant,
      // remove a role and reassign the subtree, or remove a department
      that.myDiagram.nodeTemplate.contextMenu = MAKE(
        "ContextMenu",
        MAKE("ContextMenuButton", MAKE(go.TextBlock, "Vacate Position"), {
          click: function (e, obj) {
            var node = obj.part.adornedPart;
            if (node !== null) {
              var thisemp = node.data;
              that.myDiagram.startTransaction("vacate");
              // update the key, name, and comments
              that.myDiagram.model.setDataProperty(thisemp, "name", "(Vacant)");
              that.myDiagram.model.setDataProperty(thisemp, "comments", "");
              that.myDiagram.commitTransaction("vacate");
            }
          },
        }),
        MAKE("ContextMenuButton", MAKE(go.TextBlock, "Remove Role"), {
          click: function (e, obj) {
            // reparent the subtree to this node's boss, then remove the node
            var node = obj.part.adornedPart;
            if (node !== null) {
              that.myDiagram.startTransaction("reparent remove");
              var chl = node.findTreeChildrenNodes();
              // iterate through the children and set their parent key to our selected node's parent key
              while (chl.next()) {
                var emp = chl.value;
                that.myDiagram.model.setParentKeyForNodeData(
                  emp.data,
                  node.findTreeParentNode().data.key
                );
              }
              // and now remove the selected node itself
              that.myDiagram.model.removeNodeData(node.data);
              that.myDiagram.commitTransaction("reparent remove");
            }
          },
        }),
        MAKE("ContextMenuButton", MAKE(go.TextBlock, "Remove Department"), {
          click: function (e, obj) {
            // remove the whole subtree, including the node itself
            var node = obj.part.adornedPart;
            if (node !== null) {
              that.myDiagram.startTransaction("remove dept");
              that.myDiagram.removeParts(node.findTreeParts());
              that.myDiagram.commitTransaction("remove dept");
            }
          },
        })
      );

      // define the Link template
      that.myDiagram.linkTemplate = MAKE(
        go.Link,
        go.Link.Orthogonal,
        { corner: 5, relinkableFrom: true, relinkableTo: true },
        MAKE(go.Shape, { strokeWidth: 1.5, stroke: "#F5F5F5" })
      ); // the link shape

      // read in the JSON-format data from the "mySavedModel" element
      this.load();

      console.log("window");
      console.log(window);
      console.log(window.Inspector);
      // support editing the properties of the selected person in HTML
      // if (window.Inspector)
      myInspector = new Inspector("myInspector", that.myDiagram, {
        properties: {
          key: { readOnly: true },
          comments: {},
        },
      });

      // Setup zoom to fit button
      document
        .getElementById("zoomToFit")
        .addEventListener("click", function () {
          that.myDiagram.commandHandler.zoomToFit();
        });

      document
        .getElementById("centerRoot")
        .addEventListener("click", function () {
          that.myDiagram.scale = 1;
          that.myDiagram.commandHandler.scrollToPart(
            that.myDiagram.findNodeForKey(1)
          );
        });
    }, // end init
    nodeDoubleClick(e, obj) {
      var clicked = obj.part;
      if (clicked !== null) {
        var thisemp = clicked.data;
        this.myDiagram.startTransaction("add employee");
        var newemp = {
          name: "(new person)",
          title: "",
          comments: "",
          parent: thisemp.key,
        };
        this.myDiagram.model.addNodeData(newemp);
        this.myDiagram.commitTransaction("add employee");
      }
    },
    // Show the diagram's model in JSON format
    save() {
      document.getElementById(
        "mySavedModel"
      ).value = this.myDiagram.model.toJson();
      this.myDiagram.isModified = false;
    },
    load() {
      this.myDiagram.model = go.Model.fromJson(
        document.getElementById("mySavedModel").value
      );

      // make sure new data keys are unique positive integers
      var lastkey = 1;
      this.myDiagram.model.makeUniqueKeyFunction = function (model, data) {
        var k = data.key || lastkey;
        while (model.findNodeDataForKey(k)) k++;
        data.key = lastkey = k;
        return k;
      };
    },
    // this is used to determine feedback during drags
    mayWorkFor(node1, node2) {
      if (!(node1 instanceof go.Node)) return false; // must be a Node
      if (node1 === node2) return false; // cannot work for yourself
      if (node2.isInTreeOf(node1)) return false; // cannot work for someone who works for you
      return true;
    },
    textStyle() {
      return { font: "9pt  Segoe UI,sans-serif", stroke: "#333" };
    },
    // This converter is used by the Picture.
    // findHeadShot(key) {
    //   if (key < 0 || key > 16) return "images/HSnopic.jpg"; // There are only 16 images on the server
    //   return "images/HS" + key + ".jpg";
    // }
  },
};
</script>

<style>
.class {
  background-color: #ac193d;
  background-color: #2672ec;
  background-color: #8c0095;
  background-color: #5133ab;
  background-color: #008299;
  background-color: #d24726;
  background-color: #008a00;
  background-color: #094ab2;
}
</style>
