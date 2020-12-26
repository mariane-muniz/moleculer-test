"use strict";

const {gql, GraphQLClient} = require('graphql-request')

// TODO change to correct location
const endpoint = 'http://localhost:8080/graphql';
const graphQLClient = new GraphQLClient(endpoint, {});

const findOneEntityByName = gql`
	query($name: String) {
		findOneEntityByName(name: $name) {
			id, name
		}
	}
`;
const findAttributesByEntityId = gql`
	query($entityID: String) {
		findAttributesByEntityId(entityId: $entityID) {
			id name regexValidation type
		}
	}
`;


/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
	name: "teste",

	actions: {
		getRegisters: {
			rest: { method: "GET", path: "/:entityName", params: {entityName: "string"} },
			async handler(ctx) {
				return this
					.findEntityID(ctx.params.entityName)
					.then(entityID => this.findAttributesByEntityId(entityID), this.failRequest)
					.then(attributes => this.validatePayload(attributes, ctx.params), this.failRequest)
					.then(() => this.getData(ctx.params.entityName), this.failRequest);
			}
		},
	},

	methods: {
		async findEntityID(entityName) {
			const variables = `{"name": "` + entityName + `"}`;
			return await graphQLClient
				.request(findOneEntityByName, variables)
				.then(function (response) {
					return response.findOneEntityByName.id;
				});
		},

		async findAttributesByEntityId(entityID) {
			const variables = `{"entityID": "` + entityID + `"}`;
			return await graphQLClient
				.request(findAttributesByEntityId, variables)
				.then(function (data) {
					return data.findAttributesByEntityId;
				});
		},

		async validatePayload(attributes, params) {
			return new Promise(function (resolve) {
				resolve(true);
			});
		},

		async getData(entityName) {
			return await this.broker.call("database.getData",{
				entityName: entityName
			});
		},

		failRequest(error) {
			console.log("error", error);
		}
	},
};
