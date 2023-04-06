/**
 *  @class Role
 * 
 * Class permettant de définir les deux rôles de l'application :
 * 
 * * ADMIN est autorisé à créer, modifier et supprimer des publications, commentaires et profils utilisateurs.
 * * USER rôle compte utilisateur permet de lire les topics, créer,consulter,éditer,supprimer ses propres topics
 */

export enum Role{

    ADMIN = 'admin',
    USER = 'user'
}