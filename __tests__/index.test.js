const axios = require('axios');

test('check home page response (i.e. /)', async () => {
    expect(
        (await axios('http://localhost:3000/')).data
    ).toBe(
        'You are at /'
    );
});

test('check single user api endpoint (/users/6347102ab16a3ca89f638858)', async () => {
    expect(JSON.stringify
        ((await axios('http://localhost:3000/users/6347102ab16a3ca89f638858')).data)
    ).toBe(
        `{"id":"6347102ab16a3ca89f638858","nickname":"amo21004","picture":"amo21004","role":"Administrator"}`
    );
});

test('check single review api endpoint (/reviews/63486dab644380993a785107)', async () => {
    expect(JSON.stringify
        ((await axios('http://localhost:3000/reviews/63486dab644380993a785107')).data)
    ).toBe(
        `{"_id":"63486dab644380993a785107","rating":5,"user":"amo21004","body":"Great song!","song":"What a Wonderful World"}`
    );
});

test('check single review api endpoint (/artists/63486c9b644380993a785104)', async () => {
    expect(JSON.stringify
        ((await axios('http://localhost:3000/artists/63486c9b644380993a785104')).data)
    ).toBe(
        `{"_id":"63486c9b644380993a785104","first_name":"Louis","last_name":"Armstrong","gender":"Male","date_of_birth":"1901-08-03T18:38:50.000Z"}`
    );
});

test('check single song api endpoint (/songs/635005f01d5b57b78ba0b863)', async () => {
    expect(JSON.stringify
        ((await axios('http://localhost:3000/songs/635005f01d5b57b78ba0b863')).data)
    ).toBe(
        `{"_id":"635005f01d5b57b78ba0b863","title":"What a Wonderful World","release_year":1967,"rating":5,"summary":"A song that was written by Bob Thiele and George David Weiss, and was recorded by Louis Armstrong.","artist":"63486c9b644380993a785104"}`
    );
});