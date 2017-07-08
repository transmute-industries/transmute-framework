
//     describe(".flatten", () => {
//         it("should return the flat object, ready to be many EsEventProperties", () => {
//             let flatObj: any = EventTypes.flatten(JSON_SCHEMA.Person)
//             expect(flatObj.title == JSON_SCHEMA.Person.title)
//             expect(flatObj['properties.age.description'] == JSON_SCHEMA.Person.properties.age.description)
//         })
//     })

//     describe(".unflatten", () => {
//         it("should return a fat object, ready to be a payload", () => {
//             let flatObj = EventTypes.flatten(JSON_SCHEMA.Person)
//             let fatObj: any = EventTypes.unflatten(flatObj)
//             expect(fatObj.title == JSON_SCHEMA.Person.title)
//             expect(fatObj.properties.age.description == JSON_SCHEMA.Person.properties.age.description)
//         })
//     })