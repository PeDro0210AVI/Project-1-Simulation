mod util;

//POISSON
struct PoissonResult {
    random_variable: u32,
    f: f32,
}

impl PoissonResult {
    pub fn get_random_variables(self) -> u32 {
        self.random_variable
    }
    pub fn get_f(self) -> f32 {
        self.f
    }
}

pub fn poisson(time_rate: f32) -> PoissonResult {
    let u = rand::random::<f32>().abs();

    let mut p = time_rate.exp();
    let mut f = p;

    let mut i: usize = 0;

    while (u > f) {
        p = (time_rate * p) / (i + 1) as f32;
        f = f + p;
        i += 1;
    }

    PoissonResult {
        random_variable: i as u32,
        f,
    }
}

//POISSON
