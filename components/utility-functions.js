export function returnRandomUserColor() {
  const colors = ["0038FF", "00BEE8", "1FD7C1", "6E52FF", "9327FF", "9747FF", "FC71FF", "FF4646", "FF5EB3", "FF745E"];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function getInitialsFromName(fullName) {
  const nameParts = fullName.split(" ");
  const firstNameInitial = nameParts[0].charAt(0).toUpperCase();
  const lastNameInitial = nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : "";
  return firstNameInitial + lastNameInitial;
}
