const chai = require('chai');
const td = require('testdouble');
const dbTestHelper = require('./../../helpers/database');

const { expect } = chai;


describe('clientsController', () => {

	beforeEach(async () => {
		await dbTestHelper.cleanup();
		await dbTestHelper.populate();
	});

	afterEach(async () => {
		await dbTestHelper.cleanup();
		td.reset();
	});

	after(async () => {
		await dbTestHelper.close();
	});

	it('#get should return clients list', async () => {
		const clientsList = [
			{ id: 'someid' },
		];

		const clientModel = td.replace('../../../src/models/ClientModel');
		td.when(clientModel.getList()).thenResolve(clientsList);
		const ClientsController = require('../../../src/controllers/ClientsController');

		const getResult = await ClientsController.get();

		expect(getResult)
			.to.be.an('array')
			.that.equals(clientsList);
	});

	it('#getOne should return one client', async () => {
		const clientModel = td.replace('../../../src/models/ClientModel');
		td.when(clientModel.getOne('some-client-id')).thenResolve({ id: 'some-client-id' });

		const ClientsController = require('../../../src/controllers/ClientsController');
		const getOneResult = await ClientsController.getOne({ params: { clientId: 'some-client-id' } });

		expect(getOneResult)
			.to.be.an('object')
			.and.has.property('id')
			.that.equals('some-client-id');
	});

	it('#createOne should create one client', async () => {
		const req = {
			body: {
				phoneNumber: '+4407777712333',
				firstname: 'John',
				surname: 'Doe',
			},
		};

		const validator = td.replace('../../../src/helpers/validator');
		td.when(validator.validate(td.matchers.isA(String), req.body))
			.thenReturn({ valid: true });

		const clientModel = td.replace('../../../src/models/ClientModel');
		td.when(clientModel.createOne(req.body, clientModel.hashClient(req.body))).thenResolve({ client: 'client-created' });

		const ClientsController = require('../../../src/controllers/ClientsController');
		const createOneResult = await ClientsController.createOne(req);

		expect(createOneResult)
			.to.be.an('object')
			.and.has.property('client')
			.that.is.an('string');
	});

	it('#updateOne should update one client', async () => {

		const reqCreate = {
			body: {
				phoneNumber: '+4407777712333',
				firstname: 'John',
				surname: 'Doe',
			},
		};

		const ClientsController = require('../../../src/controllers/ClientsController');

		const clientModel = td.replace('../../../src/models/ClientModel');
		td.when(clientModel.createOne(reqCreate.body, clientModel.hashClient(reqCreate.body)))
			.thenResolve({ client: 'client-created' });
		const createOneResult = await ClientsController.createOne(reqCreate);

		const req = {
			params: { clientId: createOneResult.client },
			body: {
				phoneNumber: '+4407777712666',
				firstname: 'Dorian',
				surname: 'Gray',
			},
		};

		const validator = td.replace('../../../src/helpers/validator');
		td.when(validator.validate(td.matchers.isA(String), req.body))
			.thenReturn({ valid: true });

		const updateOneResult = await ClientsController.updateOne(req);

		expect(updateOneResult).to.be.an('object');
		expect(updateOneResult).to.have.property('phonenumber').not.equal(req.body.phoneNumber);
		expect(updateOneResult).to.have.property('firstname').equal(req.body.firstname);
		expect(updateOneResult).to.have.property('surname').equal(req.body.surname);
	});

	it('#deleteOne should return success', async () => {
		const clientModel = td.replace('../../../src/models/ClientModel');
		td.when(clientModel.deleteById('some-client-id')).thenResolve();

		const ClientsController = require('../../../src/controllers/ClientsController');
		const deleteOneResult = await ClientsController.deleteOne({ params: { clientId: 'some-client-id' } });

		expect(deleteOneResult)
			.to.be.an('object')
			.and.has.property('message')
			.that.is.an('string')
			.that.equals('success');
	});
});