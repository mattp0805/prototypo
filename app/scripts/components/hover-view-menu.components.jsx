import React from 'react';
import CheckBoxWithImg from './checkbox-with-img.components.jsx';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default class HoverViewMenu extends React.Component {
	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}

	render() {
		if (process.env.__SHOW_RENDER__) {
			console.log('[RENDER] HoverViewMenu');
		}
		return (
			<div className="hover-view-menu">
				<img className="hover-view-menu-img" src="assets/images/views-icon.svg"></img>
				<div className="hover-view-menu-dropdown">
					<HoverViewMenuItem
						active={this.props.mode.indexOf('glyph') !== -1}
						toggleView={this.props.toggleView}
						text={'glyph'}/>
					<HoverViewMenuItem
						active={this.props.mode.indexOf('text') !== -1}
						toggleView={this.props.toggleView}
						text={'text'}/>
					<HoverViewMenuItem
						active={this.props.mode.indexOf('word') !== -1}
						toggleView={this.props.toggleView}
						text={'word'}/>
				</div>
			</div>
		);
	}
}

class HoverViewMenuItem extends React.Component {
	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}

	render() {
		if (process.env.__SHOW_RENDER__) {
			console.log('[RENDER] HoverViewMenuItem');
		}
		return (
			<div className="hover-view-menu-dropdown-item" onClick={() => {this.props.toggleView(this.props.text);}}>
				<div className="hover-view-menu-dropdown-item-checkbox">
					<CheckBoxWithImg checked={this.props.active}/>
				</div>
				<div className="hover-view-menu-dropdown-item-text">
					{this.props.text}
				</div>
			</div>
		);
	}
}
