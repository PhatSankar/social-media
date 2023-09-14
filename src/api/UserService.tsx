import supabase from '../supabase/supabaseClient';

async function updateUserInfo({name, udid}: {name: string; udid: string}) {
  try {
    const {data, error} = await supabase
      .from('users')
      .insert([{id: udid, name}]);
    console.log(data, error);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const UserService = {
  updateUserInfo,
};

export default UserService;
