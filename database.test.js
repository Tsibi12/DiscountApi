const db = require("./models");

beforeAll(async () => {
  await db.sequelize.sync();
});


test("create sme document", async () => {
  expect.assertions(1);
  const doc = await db.Sme_documents.create({
    id: 1,
    businessOwnerShip: "www.rikatec.co.za",
    leaseAgreement: "www.rikatec.co.za",
    bankStatement: "www.test",
    smeId: 1,
  });
  expect(doc.id).toEqual(1);
});

test("get person", async () => {
  expect.assertions(2);
  const person = await db.Sme_documents.findByPk(1);
  expect(person.businessOwnerShip).toEqual("www.rikatec.co.za");
  expect(person.leaseAgreement).toEqual("www.rikatec.co.za");
});

test("delete person", async () => {
  expect.assertions(1);
  await db.Sme_documents.destroy({
    where: {
      id: 1,
    },
  });
  const person = await db.Sme_documents.findByPk(1);
  expect(person).toBeNull();
});

afterAll(async () => {
  await db.sequelize.close();
});