let globalUsers = null;
let globalCountries = null;
let globalUserAndCountries = [];

async function start() {
  //await fetchUsers();
  //await fetchCountries();

  // console.time('promise normal');
  // await promiseUsers();
  // await promiseCountries();
  // console.timeEnd('promise normal');

  const p1 = promiseUsers();
  const p2 = promiseCountries();

  console.time('promiseAll');
  await Promise.all([p1, p2]);
  console.timeEnd('promiseAll');

  hideSpinner();
  mergeUsersAndCountries();
  render();
}

function promiseUsers() {
  return new Promise(async (resolve, reject) => {
    await fetchUsers();
    setTimeout(() => {
      resolve();
    }, 5000)
  });
}

function promiseCountries() {
  return new Promise(async (resolve, reject) => {
    await fetchCountries();
    setTimeout(() => {
      resolve();
    }, 6000)
  });
}

async function fetchUsers() {
  const res = await fetch('https://randomuser.me/api/?results=100&seed=promise&nat=us,fr,au,br');
  const json = await res.json();
  globalUsers = json.results.map(({
    login,
    name,
    nat,
    picture
  }) => {
    return {
      userId: login.uuid,
      userName: name.first,
      userCountry: nat,
      userPicture: picture.large,
    }
  });
}

async function fetchCountries() {
  const res = await fetch('https://restcountries.eu/rest/v2/all');
  const json = await res.json();
  globalCountries = json.map(({
    numericCode,
    name,
    alpha2Code,
    flag
  }) => {
    return {
      countryId: numericCode,
      countryName: name,
      countryCode: alpha2Code,
      countryFlag: flag,
    }
  });
}

function hideSpinner() {
  const spinner = document.querySelector('#spinner');
  spinner.classList.add('hide');
}

function mergeUsersAndCountries() {
  globalUsers.forEach(user => {
    const country = globalCountries.find(country => {
      return country.countryCode === user.userCountry;
    })
    globalUserAndCountries.push({
      ...user,
      ...country
    });
  })
  console.log(globalUserAndCountries);
}

function render() {
  const divUsers = document.querySelector('#divUsers');
  divUsers.innerHTML = `
    <div class='row'>
      ${globalUserAndCountries.map((item) => {
      return `
        <div class='col s6 m4 l3'>
          <div class='bordered'>
          <div class='flex-row'>
            <img class='avatar' src='${item.userPicture}'/>
            <div class='flex-col'>
              <span>${item.userName}</span>
              <img class='flag' src='${item.countryFlag}' />
            </div>
          </div>
          </div>
        </div>
        
        `;
      }).join('')}
    </div>
  `;
}

start();