// server/schema/schema.js

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID, GraphQLList, GraphQLSchema } = require('graphql');
const _ = require('lodash');

// Dummy data
const tasks = [
  { id: '1', title: 'Create your first webpage', weight: 1, description: 'HTML basics...', projectId: '1' },
  { id: '2', title: 'Structure your webpage', weight: 1, description: 'Organize HTML...', projectId: '1' }
];

const projects = [
  { id: '1', title: 'Advanced HTML', weight: 1, description: 'HTML tags...' },
  { id: '2', title: 'Bootstrap', weight: 1, description: 'CSS framework...' }
];

// Task Type
const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    weight: { type: GraphQLInt },
    description: { type: GraphQLString },
    project: {
      type: ProjectType,
      resolve(parent) {
        return _.find(projects, { id: parent.projectId });
      }
    }
  })
});

// Project Type
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    weight: { type: GraphQLInt },
    description: { type: GraphQLString },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve(parent) {
        return tasks.filter(task => task.projectId === parent.id);
      }
    }
  })
});

// Root Query
const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    task: {
      type: TaskType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(tasks, { id: args.id });
      }
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(projects, { id: args.id });
      }
    },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve() {
        return tasks;
      }
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve() {
        return projects;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQueryType
});
