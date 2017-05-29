import * as moment from 'moment'

export default [
    {
        type: "PATIENT_REGISTERED",
        payload: {
            patientId: 'patient-0',
            patientName: 'Hilary',
            insurance: 'Medicare'
        },
        meta: {
            id: 0,
            version: 'v0',
            txOrigin: '0xe609757c1c16d839c2c50bbe5447df6166134171',
            created: 1496024532
        }
    },
    {
        type: "PATIENT_REGISTERED",
        payload: {
            patientId: 'patient-1',
            patientName: 'Bill',
            insurance: 'Aetna'
        },
        meta: {
            id: 1,
            version: 'v0',
            txOrigin: '0xe609757c1c16d839c2c50bbe5447df6166134171',
            created: 1496024532
        }
    },
    {
        type: "PROVIDER_REGISTERED",
        payload: {
            providerId: 'provider-0',
            providerName: 'Mass General'
        },
        meta: {
            id: 2,
            version: 'v0',
            txOrigin: '0xe609757c1c16d839c2c50bbe5447df6166134171',
            created: 1496024532
        }
    },
    {
        type: "PROVIDER_REGISTERED",
        payload: {
            providerId: 'provider-1',
            providerName: 'Phoenix General'
        },
        meta: {
            id: 3,
            version: 'v0',
            txOrigin: '0xe609757c1c16d839c2c50bbe5447df6166134171',
            created: 1496024532
        }
    },
    {
        type: "INSURER_REGISTERED",
        payload: {
            insurerId: 'insurer-0',
            insurerName: 'Medicare'
        },
        meta: {
            id: 4,
            version: 'v0',
            txOrigin: '0xe609757c1c16d839c2c50bbe5447df6166134171',
            created: 1496024532
        }
    },
    {
        type: "INSURER_REGISTERED",
        payload: {
            insurerId: 'insurer-1',
            insurerName: 'Aetna'
        },
        meta: {
            id: 5,
            version: 'v0',
            txOrigin: '0xe609757c1c16d839c2c50bbe5447df6166134171',
            created: 1496024532
        }
    },
    {
        type: "PATIENT_TREATED",
        payload: {
            encounterId: 'encounter-0',
            patientId: 'patient-0',
            providerId: 'provider-0',
            insurerId: 'insurer-0',
            notes: 'PHI should be stored off chain!',
            timestamp: moment().add(1, 'days').toISOString()
        },
        meta: {
            id: 6,
            version: 'v0',
            txOrigin: '0xe609757c1c16d839c2c50bbe5447df6166134171',
            created: 1496024532
        }
    },
    {
        type: "CLAIM_FILED",
        payload: {
            patientId: 'patient-0',
            providerId: 'provider-0',
            insurerId: 'insurer-0',
            encounterId: 'encounter-0',
            amount: 100,
            notes: 'Claim details should be stored off chain!'
        },
        meta: {
            id: 7,
            version: 'v0',
            txOrigin: '0xe609757c1c16d839c2c50bbe5447df6166134171',
            created: 1496024532
        }
    },
    {
        type: "CLAIM_PAYED",
        payload: {
            patientId: 'patient-0',
            providerId: 'provider-0',
            insurerId: 'insurer-0',
            encounterId: 'encounter-0',
            amount: 50,
            notes: 'Medicare does not cover everything :( at least the checkup was covered.'
        },
        meta: {
            id: 8,
            version: 'v0',
            txOrigin: '0xe609757c1c16d839c2c50bbe5447df6166134171',
            created: 1496024532
        }
    },
    // {
    //     type: "PATIENT_INVOICED",
    //     payload: {
    //         patientId: 'patient-0',
    //         providerId: 'provider-0',
    //         insurerId: 'insurer-0',
    //         encounterId: 'encounter-0',
    //         invoiceId: 'athn-invoice-0',
    //         amount: '$50',
    //         notes: 'You owe your provider $50... this data is not stored on the chain...'
    //     }
    // },
    // {
    //     type: "INVOICE_PAYED",
    //     payload: {
    //         patientId: 'patient-0',
    //         providerId: 'provider-0',
    //         insurerId: 'insurer-0',
    //         encounterId: 'encounter-0',
    //         invoiceId: 'athn-invoice-0',
    //         amount: '$50',
    //         notes: '6 Months later you remember to pay that bill...',
    //         timestamp: moment().add(6, 'months').toISOString()
    //     }
    // }
]