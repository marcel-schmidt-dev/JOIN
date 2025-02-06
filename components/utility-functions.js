/**
 * Returns a random user color code from a predefined set of colors.
 *
 * @returns {string} A random hex color code from the predefined set.
 */
export function returnRandomUserColor() {
  const colors = ['0038FF', '00BEE8', '1FD7C1', '6E52FF', '9327FF', '9747FF', 'FC71FF', 'FF4646', 'FF5EB3', 'FF745E'];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Extracts the initials from a full name.
 * The initials are formed by the first letter of the first name and, if available, the first letter of the last name.
 *
 * @param {string} fullName The full name of a person.
 * @returns {string} A string containing the initials from the full name.
 */
export function getInitialsFromName(fullName) {
  const nameParts = fullName.split(' ');
  const firstNameInitial = nameParts[0].charAt(0).toUpperCase();
  const lastNameInitial = nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : '';
  return firstNameInitial + lastNameInitial;
}

/**
 * Returns a random contact name, email, and phone number from predefined lists.
 *
 * @returns {Array} An array containing a name, email, and phone number in that order.
 */
export function returnRandomContact() {
  const names = [
    'Max Mustermann',
    'Erika Mustermann',
    'Hans Müller',
    'Petra Schmidt',
    'Klaus Schneider',
    'Monika Fischer',
    'Wolfgang Weber',
    'Sabine Meyer',
    'Jürgen Wagner',
    'Andrea Becker',
    'Thomas Schulz',
    'Birgit Hoffmann',
    'Michael Bauer',
    'Ursula Koch',
    'Stefan Richter',
    'Gabriele Klein',
    'Andreas Wolf',
    'Martina Schröder',
    'Peter Neumann',
    'Susanne Schwarz',
    'Frank Zimmermann',
    'Karin Braun',
    'Ralf Krüger',
    'Heike Hofmann',
    'Joachim Hartmann',
    'Anja Lange',
    'Bernd Schmitt',
    'Claudia Werner',
    'Holger Krause',
    'Ingrid Lehmann',
    'Matthias Schmid',
    'Renate Schubert',
    'Dieter Böhm',
    'Elke Frank',
    'Manfred Albrecht',
    'Silke Simon',
    'Günter Ludwig',
    'Angelika Busch',
    'Horst Peters',
    'Christa Fuchs',
  ];
  const emails = [
    'max.mustermann@example.com',
    'erika.mustermann@example.com',
    'hans.mueller@example.com',
    'petra.schmidt@example.com',
    'klaus.schneider@example.com',
    'monika.fischer@example.com',
    'wolfgang.weber@example.com',
    'sabine.meyer@example.com',
    'juergen.wagner@example.com',
    'andrea.becker@example.com',
    'thomas.schulz@example.com',
    'birgit.hoffmann@example.com',
    'michael.bauer@example.com',
    'ursula.koch@example.com',
    'stefan.richter@example.com',
    'gabriele.klein@example.com',
    'andreas.wolf@example.com',
    'martina.schroeder@example.com',
    'peter.neumann@example.com',
    'susanne.schwarz@example.com',
    'frank.zimmermann@example.com',
    'karin.braun@example.com',
    'ralf.krueger@example.com',
    'heike.hofmann@example.com',
    'joachim.hartmann@example.com',
    'anja.lange@example.com',
    'bernd.schmitt@example.com',
    'claudia.werner@example.com',
    'holger.krause@example.com',
    'ingrid.lehmann@example.com',
    'matthias.schmid@example.com',
    'renate.schubert@example.com',
    'dieter.boehm@example.com',
    'elke.frank@example.com',
    'manfred.albrecht@example.com',
    'silke.simon@example.com',
    'guenter.ludwig@example.com',
    'angelika.busch@example.com',
    'horst.peters@example.com',
    'christa.fuchs@example.com',
  ];
  const phones = [
    '+491701234567',
    '+491712345678',
    '+491723456789',
    '+491734567890',
    '+491745678901',
    '+491756789012',
    '+491767890123',
    '+491778901234',
    '+491789012345',
    '+491790123456',
    '+491601234567',
    '+491612345678',
    '+491623456789',
    '+491634567890',
    '+491645678901',
    '+491656789012',
    '+491667890123',
    '+491678901234',
    '+491689012345',
    '+491690123456',
    '+491501234567',
    '+491512345678',
    '+491523456789',
    '+491534567890',
    '+491545678901',
    '+491556789012',
    '+491567890123',
    '+491578901234',
    '+491589012345',
    '+491590123456',
    '+491301234567',
    '+491312345678',
    '+491323456789',
    '+491334567890',
    '+491345678901',
    '+491356789012',
    '+491367890123',
    '+491378901234',
    '+491389012345',
    '+491390123456',
  ];

  const random = Math.floor(Math.random() * names.length);

  return [names[random], emails[random], phones[random]];
}

/**
 * Returns the current path of the window's URL.
 *
 * @returns {string} The current pathname from the URL.
 */
export function returnPath() {
  return window.location.pathname;
}
