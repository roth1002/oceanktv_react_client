import React, { Component, PropTypes } from 'react';
import JSTree from '../utils/tree';
import Node from '../utils/node';

export default class Tree extends Component {
  componentWillReceiveProps(nextProps) {
    if(!this._updated) {
      this.setState(this.init(nextProps));
    } else {
      this._updated = false;
    }
  }

  init(props) {
    var tree = new JSTree(props.tree);
    tree.isNodeCollapsed = props.isNodeCollapsed;
    tree.renderNode = props.renderNode;
    tree.changeNodeCollapsed = props.changeNodeCollapsed;
    tree.updateNodesPosition();

    return {
      tree: tree
    };
  }

  render() {
    const tree = new JSTree(this.props.tree);
    tree.isNodeCollapsed = this.props.isNodeCollapsed;
    tree.renderNode = this.props.renderNode;
    tree.changeNodeCollapsed = this.props.changeNodeCollapsed;
    tree.updateNodesPosition();
    return (
      <div className="m-tree">
        <Node
          tree={tree}
          index={tree.getIndex(1)}
          key={1}
          paddingLeft={this.props.paddingLeft}
          onCollapse={this.toggleCollapse.bind(this)}
        />
      </div>
    );
  }

  change(tree) {
    this._updated = true;
    if(this.props.onChange) this.props.onChange(tree.obj);
  }

  toggleCollapse(nodeId) {
    const { systemActions, tree } = this.props;
    let mytree = new JSTree(tree);
    const index = mytree.getIndex(nodeId);
    const node = index.node;
    let children = [];
    if ( node.sharepath && node.collapsed ) {
      systemActions.fetchShareFolderDynamic(node.sharepath).then( result => {
        let finalResult = [];
        let i;
        for ( i in result.response.shareFolder ) {
          children.push({
            module: result.response.shareFolder[i],
            sharepath: node.sharepath + '/' + result.response.shareFolder[i],
            collapsed: true,
            children: []
          })
        }
        node.children = children
        node.collapsed = !node.collapsed;
        mytree.build(mytree.obj);
        this.change(mytree);
      });
    } else {
      node.collapsed = !node.collapsed;
      this.change(mytree);
    }
  }
}

Tree.propTypes = {
  tree: React.PropTypes.object.isRequired,
  paddingLeft: React.PropTypes.number,
  renderNode: React.PropTypes.func.isRequired
};
