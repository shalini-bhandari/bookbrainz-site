/*
 * Copyright (C) 2020 Prabal Singh
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import CollectionsTable from './parts/collections-table';
import PagerElement from './parts/pager';
import PropTypes from 'prop-types';
import React from 'react';


class CollectionsPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			querySearchParams: props.type ? `type=${props.type}` : '',
			results: this.props.results,
			role: props.role || 'all',
			type: props.type
		};
		this.handleTypeChange = this.handleTypeChange.bind(this);
		this.handleRoleChange = this.handleRoleChange.bind(this);
		this.searchResultsCallback = this.searchResultsCallback.bind(this);
		this.paginationUrl = './collections/collections';
		this.onRoleFilterChange = this.onRoleFilterChange.bind(this);
	}

	buildQueryString(type, role) {
		const params = [];
		if (type) {
			params.push(`type=${type}`);
		}
		if (role && role !== 'all') {
			params.push(`role=${role}`);
		}
		return params.length ? `?${params.join('&')}` : '';
	}

	searchResultsCallback(newResults) {
		this.setState({results: newResults});
	}

	handleRoleChange(role) {
		this.setState((prevState) => ({
			querySearchParams: this.buildQueryString(prevState.type, role),
			role
		}));
	}

	handleTypeChange(type) {
		this.setState((prevState) => ({
			querySearchParams: this.buildQueryString(type, prevState.role),
			type
		}));
	}

	onRoleFilterChange(event) {
		this.handleRoleChange(event.target.value);
	}

	searchParamsChangeCallback = (searchParms) => {
		const type = searchParms.get('type') ?? '';
		const role = searchParms.get('role') ?? 'all';
		if (type !== this.state.type || role !== this.state.role) {
			this.setState({
				querySearchParams: this.buildQueryString(type, role),
				role,
				type
			});
		}
	};

	render() {
		return (
			<div id="pageWithPagination">
				<CollectionsTable
					entityTypes={this.props.entityTypes}
					ownerId={this.props.editor ? this.props.editor.id : null}
					results={this.state.results}
					role={this.state.role}
					showIfOwnerOrCollaborator={this.props.showIfOwnerOrCollaborator}
					showLastModified={this.props.showLastModified}
					showOwner={this.props.showOwner}
					showPrivacy={this.props.showPrivacy}
					tableHeading={this.props.tableHeading}
					type={this.state.type}
					user={this.props.user}
					onRoleChange={this.handleRoleChange}
					onTypeChange={this.handleTypeChange}
				/>
				<PagerElement
					from={this.props.from}
					nextEnabled={this.props.nextEnabled}
					paginationUrl={this.paginationUrl}
					querySearchParams={this.state.querySearchParams}
					results={this.state.results}
					searchParamsChangeCallback={this.searchParamsChangeCallback}
					searchResultsCallback={this.searchResultsCallback}
					size={this.props.size}
				/>
			</div>
		);
	}
}

CollectionsPage.displayName = 'CollectionsPage';
CollectionsPage.propTypes = {
	editor: PropTypes.object,
	entityTypes: PropTypes.array.isRequired,
	from: PropTypes.number,
	nextEnabled: PropTypes.bool.isRequired,
	results: PropTypes.array,
	role: PropTypes.string,
	showIfOwnerOrCollaborator: PropTypes.bool,
	showLastModified: PropTypes.bool,
	showOwner: PropTypes.bool,
	showPrivacy: PropTypes.bool,
	size: PropTypes.number,
	tableHeading: PropTypes.string,
	type: PropTypes.string,
	user: PropTypes.object
};
CollectionsPage.defaultProps = {
	editor: null,
	from: 0,
	results: [],
	role: 'all',
	showIfOwnerOrCollaborator: false,
	showLastModified: false,
	showOwner: false,
	showPrivacy: false,
	size: 20,
	tableHeading: 'Collections',
	type: '',
	user: null

};

export default CollectionsPage;
