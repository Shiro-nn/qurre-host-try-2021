module.exports = {
	dashboard: {
		baseURL: "localhost",//qurre.store  localhost
		cdn_reserve: "https://cdn.scpsl.store",
		cdn: "https://cdn.scpsl.store"//cdn.scpsl.store
	},
	payments: {
		public: '',
		secret: '',
	},
	DataCenter:[
		{
			id: 1,
			ip: '37.18.21.237',
			name: 'EKB EKACOD'
		},
		{
			id: 2,
			ip: '37.18.21.237',
			name: 'Moscow M9'
		},
	],
	hosts: [
		{
			id: 1,
			class: 'low',
			cpu: '1 x 4.6GHz',
			ram: '2.5GB Ram',
			dc: 1,
			sum: 500,
			data:{
				cpus: 1,
				ram: 2560
			}
		},
		{
			id: 2,
			class: 'average',
			cpu: '2 x 4.6GHz',
			ram: '5GB Ram',
			dc: 1,
			sum: 1000,
			data:{
				cpus: 2,
				ram: 5120
			}
		},
		{
			id: 3,
			class: 'good',
			cpu: '4 x 4.6GHz',
			ram: '10GB Ram',
			dc: 1,
			sum: 2000,
			data:{
				cpus: 4,
				ram: 10240
			}
		},
		{
			id: 4,
			class: 'high',
			cpu: '6 x 4.6GHz',
			ram: '15GB Ram',
			dc: 1,
			sum: 3000,
			data:{
				cpus: 6,
				ram: 15360
			}
		},

		{
			mcp: 1,
			id: 5,
			class: 'low',
			cpu: '1 x 4.2GHz',
			ram: '4GB Ram',
			dc: 2,
			sum: 400,
		},
		{
			mcp: 1,
			id: 6,
			class: 'average',
			cpu: '2 x 4.2GHz',
			ram: '5GB Ram',
			dc: 2,
			sum: 600,
		},
		{
			mcp: 2,
			id: 7,
			class: 'low',
			cpu: '1 x 5.3GHz',
			ram: '4GB Ram',
			dc: 2,
			sum: 500
		},
		{
			mcp: 2,
			id: 8,
			class: 'average',
			cpu: '2 x 5.3GHz',
			ram: '5GB Ram',
			dc: 2,
			sum: 700
		},
	],
	mongoDB: "@/ztest?authSource=admin",
}