import React from 'react';
import UndoRedoMenu from './undo-redo-menu.components.jsx';
import {TopBarMenu, TopBarMenuDropdown, TopBarMenuDropdownItem, TopBarMenuDropdownCheckBox} from './top-bar-menu.components.jsx';
import HoodieApi from '../services/hoodie.services.js';
import LocalClient from '../stores/local-client.stores.jsx';
import Lifespan from 'lifespan';

export default class Topbar extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			from:0,
			eventList: [],
			panel: {
				mode:[],
			},
		}
	}

	componentWillMount() {
		this.client = LocalClient.instance();
		this.lifespan = new Lifespan();

		const eventBackLog = this.client.getStore('/eventBackLog',this.lifespan)
			.onUpdate(({head}) => {
				const headJs = head.toJS();
				this.setState({
					to:headJs.to,
					from:headJs.from,
					eventList:headJs.eventList,
				});
			})
			.onDelete(() => {
				this.setState(undefined);
			});

		this.client.getStore('/panel', this.lifespan)
			.onUpdate(({head}) => {
				this.setState({
					panel: head.toJS(),
				});
			})
			.onDelete(() => {
				this.setState(undefined);
			})
	}

	async resetAllParams() {
		const typedata = await this.client.fetch('/fontControls');

		this.client.dispatchAction('/change-param',{values:typedata.head.toJS().presets['Modern'], force:true});
	}

	componentWillUnmount() {
		this.lifespan.release();
	}

	async logout() {
		try {
			const result = await HoodieApi.logout();
			location.href = '#/signin';
		}
		catch (error) {
			console.log(`you probably don't have internet`);
		}
	}

	toggleView(name) {
		const newViewMode = _.xor(this.state.panel.mode,[name]);
		this.client.dispatchAction('/store-panel-param',{mode:newViewMode});
	}

	render() {
		const whereAt = this.state.to || this.state.from;
		const undoDisabled = whereAt < 2;
		const redoDisabled = whereAt > (this.state.eventList.length - 2);
		const undoText = `Undo ${this.state.eventList.length && !undoDisabled ? this.state.eventList[whereAt].label : ''}`;
		const redoText = `Redo ${!redoDisabled ? this.state.eventList[whereAt+1].label : ''}`;
		return (
			<div id="topbar">
				<TopBarMenu>
					<TopBarMenuDropdown name="File">
						<TopBarMenuDropdownItem name="Logout" handler={this.logout}/>
						<TopBarMenuDropdownItem name="Reset all parameters" handler={() => { this.resetAllParams() }}/>
					</TopBarMenuDropdown>
					<TopBarMenuDropdown name="Edit">
						<TopBarMenuDropdownItem name={undoText} key="undo" disabled={undoDisabled} shortcut="ctrl+z" handler={() => {
							if(!undoDisabled)
								this.client.dispatchAction('/go-back');
						}}/>
						<TopBarMenuDropdownItem name={redoText} key="redo" disabled={redoDisabled} shortcut="ctrl+y" handler={() => {
							if (!redoDisabled)
								this.client.dispatchAction('/go-forward');
						}}/>
						<TopBarMenuDropdownItem name="Choose a preset" handler={() => {}}/>
					</TopBarMenuDropdown>
					<TopBarMenuDropdown name="View" alignRight={true}>
						<TopBarMenuDropdownCheckBox name="Glyph" checked={this.state.panel.mode.indexOf('glyph') !== -1} handler={() => { this.toggleView('glyph') }}/>
						<TopBarMenuDropdownCheckBox name="Text" checked={this.state.panel.mode.indexOf('text') !== -1} handler={() => { this.toggleView('text') }}/>
						<TopBarMenuDropdownCheckBox name="Word" checked={this.state.panel.mode.indexOf('word') !== -1} handler={() => { this.toggleView('word') }}/>
					</TopBarMenuDropdown>
				</TopBarMenu>
			</div>
		)
	}
}