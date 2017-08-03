import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Tree from './Tree';
import classnames from 'classnames';
import qs from 'qs'

export default class UiTree extends Component {

	constructor(props) {
	  super(props);

	  this.changeNodeCollapsed = ::this.changeNodeCollapsed
	  this.updateTree = ::this.updateTree
	  this.state = {
			collection: null,
			active: null,
			tree: { module: 'default' }
		}
	}

	componentWillMount() {
		this.updateTree(this.props.treeData);
	}

	componentDidMount() {
		const collection = document.getElementsByClassName("collapse");
		this.setState({ collection: collection });

		for (var i = 0; i < collection.length; i++) {
		    collection[i].addEventListener('click', this.changeNodeCollapsed, false);
				// console.log('%c + ','color: darkcyan'); console.log(collection[i]);
		}
	}

	componentWillReceiveProps(nextProps) {
		this.updateTree(nextProps.treeData);
	}

	shouldComponentUpdate(nextProps) {
		const nextTreeStr = qs.stringify(nextProps.tree, { encode: false })
		const stateTreeStr = qs.stringify(this.state.tree, { encode: false })
		const isTreeChanged = nextTreeStr !== stateTreeStr;

		return isTreeChanged
	}

	componentWillUnmount() {
		const collection = this.state.collection;

		for (var i = 0; i < collection.length; i++) {
		    collection[i].removeEventListener('click', this.changeNodeCollapsed, false);
		    // console.log('%c - ','color: tomato'); console.log(collection[i]);
		}
	}

	render() {
		return (
			<div className="tree">
			  <Tree
			    paddingLeft={20}
			    tree={this.state.tree}
			    onChange={this.handleChange.bind(this)}
			    renderNode={this.renderNode.bind(this)}
			    systemActions={this.props.systemActions}
			  />
			</div>
		);
	}

	updateTree(tree) {
	  this.setState({
	    tree: tree
	  });
	}

	handleChange(tree) {
	  this.props.onChange(tree)
	}

	renderNode(node) {
		const ClassName = classnames('node',{ 'is-active': node === this.state.active })
	  const nodeString = JSON.stringify(node);
	  return (
	    <span className={ClassName} data-node={nodeString} onClick={this.onClickNode.bind(this, node)}>
	      {node.module}
	    </span>
	  );
	}

	onClickNode(node) {
	  this.setState({
	    active: node
	  });
	  this.props.handleSelected(node);
	}

	changeNodeCollapsed(e) {
		const iconElement = e.srcElement;
		if (iconElement.classList[1] === 'caret-down') return;

		const element = iconElement.nextSibling;
		const folderName = element.innerText;
		const nodeData = JSON.parse(element.attributes['data-node'].value);
		if ( this.props.requestMoreData === 'function' ) {
			this.props.requestMoreData(nodeData);
		}
	}
}
