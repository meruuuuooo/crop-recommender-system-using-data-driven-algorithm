<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Location;
use App\Models\Province;
use App\Models\Municipality;
use App\Models\Barangay;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $province = Province::insertGetId([
            'name' => 'Misamis Oriental',
            'region_code' => 'X',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Seed Municipalities for Misamis Oriental
        $municipalities = [
            'Alubijid',
            'Balingasag',
            'Balingoan',
            'Binuangan',
            'Claveria',
            'El Salvador City',
            'Gingoog City',
            'Gitagum',
            'Initao',
            'Jasaan',
            'Kinoguitan',
            'Lagonglong',
            'Laguindingan',
            'Libertad',
            'Lugait',
            'Magsaysay',
            'Manticao',
            'Medina',
            'Naawan',
            'Opol',
            'Salay',
            'Sugbongcogon',
            'Tagoloan',
            'Talisayan',
            'Villanueva',
        ];

        $municipalityIds = [];
        foreach ($municipalities as $municipality) {
            $municipalityIds[$municipality] = Municipality::insertGetId([
                'province_id' => $province,
                'name' => $municipality,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $barangays = [
            'Alubijid' => [
            'Baybay', 'Benigwayan', 'Calatcat', 'Lagtang', 'Loguilo', 'Lumbo', 'Molocboloc', 'Pelaez', 'Poblacion', 'Taparak', 'Tugasnon'
            ],
            'Balingasag' => [
            'Binitinan', 'Cabulig', 'Cogon', 'Kauswagan', 'Linggangao', 'Mambayaan', 'Mandangoa', 'Mapua', 'Poblacion', 'San Isidro', 'San Juan', 'San Pedro', 'Talusan', 'Waterfall'
            ],
            'Balingoan' => [
            'Balingoan', 'Mantangale', 'Mapua', 'Poblacion', 'Samburon', 'San Alonzo', 'San Isidro', 'San Jose', 'San Roque'
            ],
            'Binuangan' => [
            'Binuangan', 'Kitamban', 'Kitambis', 'Mabini', 'Matampa', 'Mosangot', 'Poblacion', 'Samburon'
            ],
            'Claveria' => [
            'Aposkahoy', 'Bulahan', 'Cabacungan', 'Canaan', 'Gumaod', 'Hinaplanan', 'Lanise', 'Luna', 'Mambayaan', 'Mat-i', 'Patrocenio', 'Poblacion', 'Rizal', 'Santa Cruz', 'Tamboboan'
            ],
            'El Salvador City' => [
            'Amoros', 'Bolisong', 'Cogon', 'Hindang', 'Hinigdaan', 'Kalabaylabay', 'Molugan', 'Poblacion', 'Quibonbon', 'Sambulawan', 'Sinaloc', 'Taganipa'
            ],
            'Gingoog City' => [
            'Agay-ayan', 'Anakan', 'Bantaawan', 'Binuangan', 'Calabrian', 'Daan-Lungsod', 'Kabulakan', 'Kalagonoy', 'Kamanikan', 'Kianlagan', 'Lawit', 'Libertad', 'Lunotan', 'Mabini', 'Malibud', 'Mimbuntong', 'Odiongan', 'Poblacion', 'Punong', 'San Juan', 'San Luis', 'Santiago', 'Tagpako', 'Tinulongan'
            ],
            'Gitagum' => [
            'Burnay', 'Carlos P. Garcia', 'Gimaylan', 'Kilangit', 'Matangad', 'Poblacion', 'Quezon', 'Tingalan'
            ],
            'Initao' => [
            'Andales', 'Apas', 'Aposkahoy', 'Calacapan', 'Cawag', 'Jampason', 'Kauswagan', 'Oguis', 'Poblacion', 'San Pedro', 'Sinaloc', 'Taboc', 'Tubigan'
            ],
            'Jasaan' => [
            'Aplaya', 'Bobontugan', 'Corrales', 'Guihing', 'I.S. Cruz', 'Kimaya', 'Lower Jasaan', 'Luyang', 'Natubo', 'Poblacion', 'San Isidro', 'San Nicolas', 'Solana', 'Upper Jasaan'
            ],
            'Kinoguitan' => [
            'Beray', 'Bolisong', 'Calubo', 'Esperanza', 'Gingoog', 'Kitambis', 'Mambayaan', 'Poblacion', 'Salicapawan', 'Salubsob', 'Samburon', 'Sibantang', 'Talisay'
            ],
            'Lagonglong' => [
            'Banglay', 'Dampil', 'Gingoog', 'Guinalaban', 'Kauswagan', 'Lumbo', 'Mambayaan', 'Poblacion', 'Tabok'
            ],
            'Laguindingan' => [
            'Aposkahoy', 'Buntawan', 'Lapad', 'Libertad', 'Lourdes', 'Moro', 'Moog', 'Poblacion', 'Sambulawan', 'Santiago'
            ],
            'Libertad' => [
            'Dulong', 'Gimaylan', 'Kauswagan', 'Lourdes', 'Poblacion', 'Sambulawan', 'Tingalan'
            ],
            'Lugait' => [
            'Aya-aya', 'Biga', 'Calangahan', 'Kaluknayan', 'Lower Talacogon', 'Poblacion', 'Upper Talacogon'
            ],
            'Magsaysay' => [
            'Abunda', 'Artadi', 'Balaon', 'Bantayan', 'Bonifacio Aquino', 'Consuelo', 'Kauswagan', 'Lourdes', 'Poblacion', 'San Isidro', 'San Vicente', 'Santa Cruz'
            ],
            'Manticao' => [
            'Aposkahoy', 'Balintad', 'Bantawan', 'Camanga', 'Digkilaan', 'Lourdes', 'Mambayaan', 'Pagawan', 'Patag', 'Poblacion', 'Tuod'
            ],
            'Medina' => [
            'Badiangon', 'Balingasag', 'Bunaguit', 'Duka', 'Gingoog', 'Lourdes', 'Mabini', 'Magsaysay', 'Pahindong', 'Poblacion', 'San Isidro', 'San Jose', 'San Vicente', 'South Poblacion'
            ],
            'Naawan' => [
            'Don Pedro', 'Linangkayan', 'Lubilan', 'Mapulog', 'Mat-i', 'Poblacion', 'Tagbalogo'
            ],
            'Opol' => [
            'Awang', 'Bagocboc', 'Barra', 'Bonbon', 'Cauyonan', 'Igpit', 'Luyong Bonbon', 'Malanang', 'Patag', 'Poblacion', 'Taboc'
            ],
            'Salay' => [
            'Alipuaton', 'Ampenican', 'Bunal', 'Casulog', 'Dinagsaan', 'Looc', 'Matampa', 'Poblacion', 'Salagsag', 'San Roque', 'Sibantang', 'Tinagaan'
            ],
            'Sugbongcogon' => [
            'Aposkahoy', 'Kaulayanan', 'Kauswagan', 'Kidampas', 'Mangga', 'Mimbunga', 'Poblacion', 'Santa Cruz', 'Silad', 'Talon'
            ],
            'Tagoloan' => [
            'Baluarte', 'Camp 3', 'Casinglot', 'Gracia', 'Mohon', 'Natumolan', 'Pablo D. Lim', 'Poblacion', 'Rosario', 'Santa Ana', 'Santa Cruz', 'Sugbongcogon', 'Sulog'
            ],
            'Talisayan' => [
            'Balingasag', 'Binitinan', 'Calamcam', 'Casinglot', 'Macopa', 'Magkarila', 'Mambayaan', 'Poblacion', 'Punta Santiago', 'San Jose', 'San Juan', 'San Pedro', 'Sibantang', 'Tagbocboc'
            ],
            'Villanueva' => [
            'Balacanas', 'Dayawan', 'Katipunan', 'Kimaya', 'Poblacion 1', 'Poblacion 2', 'San Martin', 'Tambobong'
            ],
        ];

        foreach ($barangays as $municipality => $barangayList) {
            if (!isset($municipalityIds[$municipality])) {
                continue;
            }
            foreach ($barangayList as $barangay) {
                Barangay::insert([
                    'municipality_id' => $municipalityIds[$municipality],
                    'name' => $barangay,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $allBarangays = Barangay::all();

        for ($i = 0; $i < 10; $i++) {
            $randomBarangay = $allBarangays->random();
            Location::factory()->create([
                'province_id' => $province,
                'municipality_id' => $randomBarangay->municipality_id,
                'barangay_id' => $randomBarangay->id,
            ]);
        }
    }
}
