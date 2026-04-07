export const secretaires = [
  {
    id: 1,
    username: "anna.rakoto",
    email: "anna.rakoto@exemple.com",
    telephone: "+33 6 12 34 56 78",
  },
  {
    id: 2,
    username: "sophie.rabe",
    email: "sophie.rabe@exemple.com",
    telephone: "+33 6 11 22 33 44",
  },
  {
    id: 3,
    username: "jean.kely",
    email: "jean.kely@exemple.com",
    telephone: "+33 6 55 44 33 22",
  },
  {
    id: 4,
    username: "celine.ranaivo",
    email: "celine.ranaivo@exemple.com",
    telephone: "+33 6 66 77 88 99",
  },
] as const;

export const medecins = [
  {
    id: 1024,
    nom: "Paul Rakoto",
    specialite: "Cardiologue",
    telephone: "+261 34 12 345 67",
    adresse: "Lot IV 22 Ankadifotsy, Antananarivo",
  },
  {
    id: 1025,
    nom: "Marie Rasolo",
    specialite: "Généraliste",
    telephone: "+261 32 22 334 45",
    adresse: "Ambohijatovo, Antananarivo",
  },
  {
    id: 1026,
    nom: "Sophie Rabei",
    specialite: "Pédiatre",
    telephone: "+261 33 55 443 32",
    adresse: "En face du Carlton, Anosy",
  },
  {
    id: 1027,
    nom: "Jean Koto",
    specialite: "Dermatologue",
    telephone: "+261 34 77 445 56",
    adresse: "67 Ha Centre, Antananarivo",
  },
  {
    id: 1028,
    nom: "Claire Mahery",
    specialite: "Gynécologue",
    telephone: "+261 32 66 778 89",
    adresse: "Près de l'Hôtel de Ville, Analakely",
  },
] as const;

export const patients = [
  {
    id: 1024,
    nom: "Rabe",
    prenom: "Samy",
    dateNaissance: "1989-05-12",
    telephone: "+261 34 12 345 67",
    adresse: "Lot II 34 Ankorondrano",
    email: "rabe.samy@gmail.com"
  },
  {
    id: 1025,
    nom: "Rakoto",
    prenom: "Harisoa",
    dateNaissance: "1982-11-20",
    telephone: "+261 32 22 334 45",
    adresse: "Ambohijatovo",
    email: "harisoa.rakoto@yahoo.fr"
  },
  {
    id: 1026,
    nom: "Rasolo",
    prenom: "Jean",
    dateNaissance: "1973-02-15",
    telephone: "+261 33 44 553 37",
    adresse: "67 Ha Sud",
    email: "jean.rasolo@outlook.mg"
  },
  {
    id: 1027,
    nom: "Ranaivo",
    prenom: "Anna",
    dateNaissance: "1997-08-30",
    telephone: "+261 34 11 665 54",
    adresse: "Anosy, Villa 12",
    email: "anna.ranaivo@gmail.com"
  },
  {
    id: 1028,
    nom: "Koto",
    prenom: "Sylvain",
    dateNaissance: "1959-01-10",
    telephone: "+261 32 77 884 41",
    adresse: "Manakambahiny",
    email: "koto.sylvain@moov.mg"
  }
] as const;
