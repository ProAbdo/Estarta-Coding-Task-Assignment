const { sequelize, User } = require('../src/models');

async function run() {
	try {
		await sequelize.authenticate();
		const count = await User.count();
		if (count === 0) {
			console.log('Users table empty. Running seeders...');
			const { spawn } = require('child_process');
			await new Promise((resolve, reject) => {
				const proc = spawn('npx', ['sequelize-cli', 'db:seed:all'], { stdio: 'inherit' });
				proc.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`Seeders exited with code ${code}`))));
			});
			console.log('Seeding done.');
		} else {
			console.log(`Users table has ${count} rows. Skipping seeders.`);
		}
	} catch (err) {
		console.error('seed-if-empty failed:', err.message);
		process.exit(1);
	} finally {
		await sequelize.close();
	}
}

run();

