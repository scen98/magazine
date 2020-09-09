export function getHighestPermission(permissions){
    return Math.max.apply(Math, permissions.map(function(p) { return p.level; }));
}

export function hasCmlAccesToColumn(permissions, column){
    for (let perm of permissions) {
       if(perm.columnId == column.id) return true;
    }
    return false;
}

export function isNormal(permission){
    if(permission.level <= 10){
        return true;
    }
    return false;
}

export function isCma(permission){
    if(permission.level >= 20){
        return true;
    }
    return false;
}

export function isCml(permission){
    if(permission.level >= 30){
        return true;
    }
    return false;
}

export function isAdmin(permission){
    if(permission.level >= 40){
        return true;
    }
    return false;
}

export function isSuperAdmin(permission){
    if(permission.level >= 50){
        return true;
    }
    return false;
}